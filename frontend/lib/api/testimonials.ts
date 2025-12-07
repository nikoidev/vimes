import axios from '../axios'

export interface Testimonial {
  id: number
  client_name: string
  client_position?: string
  client_company?: string
  client_location?: string
  testimonial: string
  rating: number
  client_photo?: string
  is_published: boolean
  is_featured: boolean
  order: number
  created_at: string
  updated_at?: string
}

export interface TestimonialCreate {
  client_name: string
  client_position?: string
  client_company?: string
  client_location?: string
  testimonial: string
  rating: number
  client_photo?: string
  is_published: boolean
  is_featured: boolean
  order: number
}

export const getTestimonials = async (params?: { published_only?: boolean }) => {
  const response = await axios.get('/api/testimonials', { params })
  return response.data
}

export const getTestimonialById = async (id: number) => {
  const response = await axios.get(`/api/testimonials/${id}`)
  return response.data
}

export const createTestimonial = async (data: TestimonialCreate) => {
  const response = await axios.post('/api/testimonials', data)
  return response.data
}

export const updateTestimonial = async (id: number, data: Partial<TestimonialCreate>) => {
  const response = await axios.put(`/api/testimonials/${id}`, data)
  return response.data
}

export const deleteTestimonial = async (id: number) => {
  const response = await axios.delete(`/api/testimonials/${id}`)
  return response.data
}
