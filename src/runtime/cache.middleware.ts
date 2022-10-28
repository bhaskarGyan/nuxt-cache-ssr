
import InMemoryCache from './cache.inmemory'
import { options } from '#cache-ssr-options'
import { isUrlCacheable } from './cache.utils'
import { fromNodeMiddleware } from 'h3'

const customKey = options.key ? eval(options.key) : null

export default fromNodeMiddleware(async (req, res, next) => {
  const { url } = req
  if (isUrlCacheable(req, options.pages)) {
    const key = customKey ? customKey(url, req.headers) : url;
    console.log("key fromNodeMiddleware : ", key)
    const cachedRes = await InMemoryCache.get(key);
    if (cachedRes) {
      res.writeHead(200, { ...cachedRes.headers, 'x-ssr-cache': 'Hit!!!' });
      res.end(cachedRes.body)
    }
  }

})