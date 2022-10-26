import { defineNuxtModule, createResolver, addServerHandler } from '@nuxt/kit'
export interface ModuleOptions {
  addPlugin: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-cache-ssr',
    configKey: 'cacheSSR',
    compatibility: {
      nuxt: '^3.0.0-rc.9'
    }
  },
 async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = await resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
 
    nuxt.hook('nitro:config', (nitro) => {
      nitro.externals = nitro.externals || {}
      nitro.externals.inline = nitro.externals.inline || []
      nitro.externals.inline.push(runtimeDir)
     nitro.virtual = nitro.virtual || {}
     nitro.virtual['#cache-ssr-options'] = `export const options = ${JSON.stringify(options, null, 2)}`
      nitro.plugins = nitro.plugins || []
      nitro.plugins.push(resolve('runtime/cache.nitro'))
    })
  
    addServerHandler({
      handler: resolve("runtime/cache.middleware")
    })
  }
})
