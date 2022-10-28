import InMemoryCache from './cache.inmemory'
import { options } from '#cache-ssr-options'
import { isUrlCacheable } from './cache.utils'
import type { NitroAppPlugin } from 'nitropack'
import generateFlags from './generateFlags'

const customKey = options.key ? eval(options.key) : null

export default <NitroAppPlugin>async function (nitroApp) {
  const cacheOption = options.store || {};
  await InMemoryCache.init(cacheOption)
  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    const isCacheable = isUrlCacheable(event.req, options.pages)
    if (isCacheable && response.statusCode === 200) {
      const key = customKey ? customKey(event.req.url, event.req.headers, generateFlags(event.req.headers, event.req.headers['user-agent'])) : event.req.url
      await InMemoryCache.set(key, response)

    }

  })
}