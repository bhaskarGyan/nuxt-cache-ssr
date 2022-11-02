import InMemoryCache from './cache.inmemory'
import zlib from "node:zlib";
import { options } from '#cache-ssr-options'
import { isUrlCacheable } from './cache.utils'
import type { NitroAppPlugin } from 'nitropack'
import generateFlags from './generateFlags'

const customKey = options.key ? eval(options.key) : null

const gzipOptions = { level: zlib.constants.Z_BEST_COMPRESSION }
const brotliOptions = {
  [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
  [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.Z_BEST_COMPRESSION,
}

const { encoding = '' } = options.compressResponse || {} as any

const compressedBuff = (fileContents: string) => {
  return new Promise((resolve, reject) => {
    const cb = (error, result?: Buffer) => error ? reject(error) : resolve(result)
    if (encoding === 'gzip') {
      zlib.gzip(fileContents, gzipOptions, cb)
    } else if (encoding === 'br') {
      zlib.brotliCompress(fileContents, brotliOptions, cb)
    } else {
      cb('Invalid compression option. Please provide either br or gzip')
    }
  })
}

export default <NitroAppPlugin>async function (nitroApp) {
  const cacheOption = options.store || {};

  await InMemoryCache.init(cacheOption);

  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    const isCacheable = isUrlCacheable(event.req, event.res, options.pages)
    if (isCacheable && response.statusCode === 200) {
      const key = customKey ? customKey(event.req.url, event.req.headers, generateFlags(event.req.headers, event.req.headers['user-agent'])) : event.req.url
      let cachedRes = response;

      if (encoding) {
        const encodedBuffer = await compressedBuff(response.body);

        cachedRes = {
          ...cachedRes, body: encodedBuffer, headers: {
            ...cachedRes.headers, "content-encoding": encoding
          }
        }
      }

      await InMemoryCache.set(key, cachedRes);

    }

  })
}