import type { Ref } from 'vue'
import { ref } from 'vue'
import { type ClientConfig, createClient } from '@sanity/client'

const config: ClientConfig = {
  projectId: 'iz0rdcef',
  dataset: 'production',
  useCdn: true, // set to `true` to fetch from edge cache
  apiVersion: '2022-01-12', // use current date (YYYY-MM-DD) to target the latest API version
}
const client = createClient(config)
interface Cache {
  [key: string]: any
}

const cache: Ref<Cache> = ref({})

export default function useSanityCache() {
  async function fetch<T = any>(query: string, params: Record<string, any> = {}, cacheKey: string, ignoreCache = false): Promise<T> {
    if (!cacheKey)
      throw new Error('You must provide a cacheKey')

    if (!ignoreCache && cache.value[cacheKey])
      return cache.value[cacheKey]

    const result: T = await client.fetch(query, params)
    cache.value[cacheKey] = result
    return result
  }

  return {
    cache,
    fetch,
  }
}
