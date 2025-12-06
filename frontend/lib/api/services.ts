import axios from '../axios'
import type { Service, ServiceCreate, ServiceUpdate } from '@/types'

export const servicesApi = {
  getAll: async (params?: {
    skip?: number
    limit?: number
    active_only?: boolean
    featured_only?: boolean
  }) => {
    const { data } = await axios.get<Service[]>('/api/services/', { params })
    return data
  },

  getById: async (id: number) => {
    const { data } = await axios.get<Service>(`/api/services/${id}`)
    return data
  },

  getBySlug: async (slug: string) => {
    const { data } = await axios.get<Service>(`/api/services/slug/${slug}`)
    return data
  },

  create: async (service: ServiceCreate) => {
    const { data } = await axios.post<Service>('/api/services/', service)
    return data
  },

  update: async (id: number, service: ServiceUpdate) => {
    const { data } = await axios.put<Service>(`/api/services/${id}`, service)
    return data
  },

  delete: async (id: number) => {
    await axios.delete(`/api/services/${id}`)
  },
}

// Export individual functions for convenience
export const getServices = servicesApi.getAll
export const getServiceById = servicesApi.getById
export const getServiceBySlug = servicesApi.getBySlug
export const createService = servicesApi.create
export const updateService = servicesApi.update
export const deleteService = servicesApi.delete
