# nuxt-cache-ssr
[![NPM version](https://img.shields.io/npm/v/nuxt-cache-ssr.svg)](https://www.npmjs.com/package/nuxt-cache-ssr)

In Memory Cache middleware for Nuxt3 SSR rendering .

## Setup
```npm install nuxt-cache-ssr```

or

```yarn add nuxt-cache-ssr```

then inside your `nuxt.config.js` add cache config:

```javascript
module.exports = {
  modules: [
      'nuxt-cache-ssr',
  ],
  cache: {
   
    pages: [
      // these are prefixes of pages that need to be cached
      '/page1',
      '/page2',

    ],
    key:(route:string,headers: any,device:Device)=>{

          //sample of using device to generate key
        
          const {userAgent,...deviceType} = device
          const key = [route];
          Object.keys(deviceType).forEach(val => {
            if(deviceType[val]){
              key.push(val)
            }
          })
           // returned value will be hashed using ohash
          return key.join("-")
    }
  },

  // ...
};
```


### TODO

- [ ] In Memory cache options
- [ ] Regex for Pages
- [ ] Custom Key for Page Cache
- [ ] Redis Cache