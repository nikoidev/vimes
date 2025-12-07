import axios from '../axios'
import type { SiteConfig, SiteConfigUpdate } from '@/types'

export const siteConfigApi = {
  get: async () => {
    const { data } = await axios.get<SiteConfig>('/site-config/')
    return data
  },

  update: async (config: SiteConfigUpdate) => {
    const { data } = await axios.put<SiteConfig>('/site-config/', config)
    return data
  },
}
