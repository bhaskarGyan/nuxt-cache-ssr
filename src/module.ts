import { defineNuxtModule, createResolver, addServerHandler } from '@nuxt/kit'
export interface ModuleOptions {
  enabled: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-cache-ssr',
    configKey: 'cacheSSR',
    compatibility: {
      nuxt: '^3.0.0-rc.9'
    },
    default: {
      enabled: true
    }
  },
  async setup(options, nuxt) {
    if (!options.enabled) return
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = await resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    nuxt.hook('nitro:config', (nitro) => {
      nitro.externals = nitro.externals || {}
      nitro.externals.inline = nitro.externals.inline || []
      nitro.externals.inline.push(runtimeDir)
      nitro.virtual = nitro.virtual || {}
      nitro.virtual['#cache-ssr-options'] = `export const options = ${JSON.stringify(options, function (key, val) {
        if (typeof val === 'function') {
          return val + '';
        }
        return val;
      }, 2)}`
      nitro.plugins = nitro.plugins || []
      nitro.plugins.push(resolve('runtime/cache.nitro'))
    })

    addServerHandler({
      handler: resolve("runtime/cache.middleware")
    })
  }
})
