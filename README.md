# nuxt-cache-ssr
[![NPM version](https://img.shields.io/npm/v/nuxt-cache-ssr.svg)](https://www.npmjs.com/package/nuxt-cache-ssr)
[![npm downloads][npm-downloads-src]][npm-downloads-href]


In Memory Cache middleware for Nuxt3 SSR rendering .

## TODO

- [x] In Memory cache options
- [x] Custom Key for Page Cache
- [x] option to disable per enviroment
- [x] Compress cached response (experimental)
- [x] Disble page cached on demand (experimental)
- [ ] Regex for Pages
- [ ] Redis Cache
- [ ] Auto refresh cache before expiry (?)

## Setup
```npm install nuxt-cache-ssr```

or

```yarn add nuxt-cache-ssr```

then inside your `nuxt.config.js` add cache config:

```javascript
export default defineNuxtConfig({
  modules: [
    ['nuxt-cache-ssr', {
      // Can be disable per enviroment, like in dev
      enabled: true,
      store: {
        // Plceholder for store type, will be usable after Redis Release
        type: 'memory',
        // maximum number of pages to store in memory
        // if limit is reached, least recently used page
        // is removed.
        max: 500,
        // number of Millisecond to store this page in cache
        ttl: 1000 * 60 // 1 Minute
      },
      pages: [
        // these are prefixes of pages that need to be cached, for caching homepage use '/'
        '/page1',
        '/page2',

      ],
      key: (route: string, headers: any, device: Device) => {
          // Custom function to return cache key
          // return false to bypass cache
        
      }
    }
    ],
  ],

  // ...
})
```

## Configuration

| Option | Type | Required | Description | Default |
| ------ | ---- | ------ | ----------- | ------- |
| enabled | `boolean` | No |To enable/ disable the SSR cache | `true` |
| store | `object` | No | SSR cache store options | `{type:'',max:500,ttl:10000}` |
| pages | `Array` |  Yes |Pages to cache | N/A |
| key | `Function` |  No | Use for generating custo key based on route,headers,and device type. Returned string will be hashed using `ohash`. return false to bypass cache | `url` |
||||||


## Device Interface
```javascript
interface Device {
  userAgent: string
  isDesktop: boolean
  isIos: boolean
  isAndroid: boolean
  isMobile: boolean
  isMobileOrTablet: boolean
  isDesktopOrTablet: boolean
  isTablet: boolean
  isWindows: boolean
  isMacOS: boolean
  isApple: boolean
  isSafari: boolean
  isFirefox: boolean
  isEdge: boolean
  isChrome: boolean
  isSamsung: boolean
  isCrawler: boolean
}
```
## caveat
**important security warning** : don't load secret keys such as user credential on the server for cached pages.
 _this is because they will cache for all users!_

<!-- Badges -->

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-cache-ssr
[npm-downloads-href]: https://npmjs.com/package/nuxt-cache-ssr
