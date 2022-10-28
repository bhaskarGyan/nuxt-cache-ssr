// import LRU from 'lru-cache';
import { caching } from 'cache-manager'
import { hash } from 'ohash';


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

    async init() {
        this.cached = await caching('memory', {
            max: 500,
            ttl: Number(108000)
        })
    }

}



export default new InMemoryCache()