# nuxt-cache-ssr
[![NPM version](https://img.shields.io/npm/v/nuxt-cache-ssr.svg)](https://www.npmjs.com/package/nuxt-cache-ssr)

In Memory Cache middleware for Nuxt3 SSR rendering .

### TODO

- [x] In Memory cache options
- [ ] Regex for Pages
- [x] Custom Key for Page Cache
- [ ] Redis Cache
- [x] option to disable per enviroment

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
        // these are prefixes of pages that need to be cached
        '/page1',
        '/page2',

      ],
      key: (route: string, headers: any, device: Device) => {

        // Link to the function will be broken, so cannot use any imported modules or custom functions
        //sample of using device to generate key

        const { userAgent, ...deviceType } = device
        const key = [route];
        Object.keys(deviceType).forEach(val => {
          if (deviceType[val]) {
            key.push(val)
          }
        })
        // returned value will be hashed using ohash
        return key.join("-")
      }
    }
    ],
  ],

  // ...
})
```
### Device Interface
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
