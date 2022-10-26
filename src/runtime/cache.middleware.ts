
import InMemoryCache from './cache.inmemory'
import { options } from '#cache-ssr-options'
import { isUrlCacheable } from './cache.utils'
import {fromNodeMiddleware} from 'h3'

export default fromNodeMiddleware(async (req, res, next) => {
  const { url } = req
  if (isUrlCacheable(req, options.pages)) {
    const cachedRes = await InMemoryCache.get(url);
    if (cachedRes) {
      res.writeHead(200, { ...cachedRes.headers, 'x-ssr-cache': 'Hit!!!' });
      res.end(cachedRes.body)
    }
  }

})