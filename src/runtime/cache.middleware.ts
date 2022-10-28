
import InMemoryCache from './cache.inmemory'
import { options } from '#cache-ssr-options'
import { isUrlCacheable } from './cache.utils'
import { fromNodeMiddleware } from 'h3'
import generateFlags from '../generateFlags'

const customKey = options.key ? eval(options.key) : null

export default fromNodeMiddleware(async (req, res, next) => {
  const { url } = req
  if (isUrlCacheable(req, options.pages)) {
    const key = customKey ? customKey(url, req.headers, generateFlags(req.headers, req.headers['user-agent'])) : url;
    const cachedRes = await InMemoryCache.get(key);
    if (cachedRes) {
      res.writeHead(200, { ...cachedRes.headers, 'x-ssr-cache': 'HIT' });
      res.end(cachedRes.body)
    } else {
      res.setHeader('x-ssr-cache', 'MISS')
    }
  }

})