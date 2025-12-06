import axios from '../axios'
import type { Service, ServiceCreate, ServiceUpdate } from '@/types'

export const servicesApi = {
  getAll: async (params?: {
    skip?: number
    limit?: number
    active_only?: boolean
    featured_only?: boolean
  }) => {
    const { data } = await axios.get<Service[]>('/services/', { params })
    return data
  },

  getById: async (id: number) => {
    const { data } = await axios.get<Service>(`/services/${id}`)
    return data
  },

  getBySlug: async (slug: string) => {
    const { data } = await axios.get<Service>(`/services/slug/${slug}`)
    return data
  },

  create: async (service: ServiceCreate) => {
    const { data } = await axios.post<Service>('/services/', service)
    return data
  },

  update: async (id: number, service: ServiceUpdate) => {
    const { data } = await axios.put<Service>(`/services/${id}`, service)
    return data
  },

  delete: async (id: number) => {
    await axios.delete(`/services/${id}`)
  },
}
