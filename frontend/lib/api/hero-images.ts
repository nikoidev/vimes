import axiosInstance from '../axios'
import type { HeroImage, HeroImageCreate, HeroImageUpdate } from '@/types'

export const heroImagesApi = {
  getAll: async (params?: {
    skip?: number
    limit?: number
    active_only?: boolean
  }) => {
    const { data } = await axiosInstance.get<HeroImage[]>('/api/hero-images/', { params })
    return data
  },

  getById: async (id: number) => {
    const { data } = await axiosInstance.get<HeroImage>(`/api/hero-images/${id}`)
    return data
  },

  create: async (image: HeroImageCreate) => {
    const { data } = await axiosInstance.post<HeroImage>('/api/hero-images/', image)
    return data
  },

  update: async (id: number, image: HeroImageUpdate) => {
    const { data } = await axiosInstance.put<HeroImage>(`/api/hero-images/${id}`, image)
    return data
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`/api/hero-images/${id}`)
  },
}
