import { options } from '#cache-ssr-options'



export const isUrlCacheable = (req, res, pages = []) => {
    const { disableCacheOnDemand = {} } = options;
    const { headerKey = '' } = disableCacheOnDemand;
    const { url } = req
    let isCacheable = false

    if (headerKey) {
        const resHeaders = res.getHeaders();
        if (headerKey in resHeaders) {
            return false
        }
    }

    pages.forEach(page => {
        if (url?.startsWith(page) || (page === '/' && url === page)) {
            isCacheable = true
        }
    });

    return isCacheable

}