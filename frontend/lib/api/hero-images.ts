import axios from '../axios'

export interface HeroImage {
  id: number
  title: string
  description: string | null
  image_url: string
  alt_text: string
  is_active: boolean
  order: number
  created_at: string
  updated_at: string | null
}

export interface HeroImageCreate {
  title: string
  description?: string | null
  image_url: string
  alt_text: string
  is_active?: boolean
  order?: number
}

export interface HeroImageUpdate {
  title?: string
  description?: string | null
  image_url?: string
  alt_text?: string
  is_active?: boolean
  order?: number
}

export const heroImagesApi = {
  getAll: async (params?: {
    skip?: number
    limit?: number
    active_only?: boolean
  }) => {
    const { data } = await axios.get<HeroImage[]>('/api/hero-images/', { params })
    return data
  },

  getById: async (id: number) => {
    const { data } = await axios.get<HeroImage>(`/api/hero-images/${id}`)
    return data
  },

  create: async (image: HeroImageCreate) => {
    const { data } = await axios.post<HeroImage>('/api/hero-images/', image)
    return data
  },

  update: async (id: number, image: HeroImageUpdate) => {
    const { data } = await axios.put<HeroImage>(`/api/hero-images/${id}`, image)
    return data
  },

  delete: async (id: number) => {
    await axios.delete(`/api/hero-images/${id}`)
  },
}

// Export individual functions for convenience
export const getHeroImages = heroImagesApi.getAll
export const getHeroImageById = heroImagesApi.getById
export const createHeroImage = heroImagesApi.create
export const updateHeroImage = heroImagesApi.update
export const deleteHeroImage = heroImagesApi.delete
