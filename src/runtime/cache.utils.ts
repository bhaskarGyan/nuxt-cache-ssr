
export const isUrlCacheable = (req, pages = []) => {

    const { url } = req
    let isCacheable = false

    pages.forEach(page => {
        if (url?.startsWith(page) || (page === '/' && url === page)) {
            isCacheable = true
        }
    });


    return isCacheable

}