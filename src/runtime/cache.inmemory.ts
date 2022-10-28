// import LRU from 'lru-cache';
import { caching } from 'cache-manager'
import { hash } from 'ohash';
import { options } from '#cache-ssr-options'

const DefaultCacheOption = {
    max: 500,
    ttl: 10000
}
interface CacheOptions {
    max: number;
    ttl: number;
}
const DefaultOptionsLRU = {
    max: 500,
    ttl: 1000 * 60,
}
interface InMemory {
    initialized: boolean
}
class InMemoryCache {
    cached: any;

    constructor(options = {}) {
        this.cached = {}
    }

    async get(key: string) {

        const result = await this.cached.get(hash(key))
        return result
    }

    async set(key: string, value: any) {

        await this.cached.set(hash(key), value)
    }

    async init(options: CacheOptions) {
        let cachingOption: CacheOptions = DefaultCacheOption;
        if (options !== null && typeof options === 'object') {
            cachingOption = { ...cachingOption, ...options }
        }
        this.cached = await caching('memory', cachingOption)
    }

}



export default new InMemoryCache()