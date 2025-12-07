import axiosInstance from '../axios'
import { CMSPage, CMSPageCreate, CMSPageUpdate } from '@/types'

export const cmsPagesApi = {
  async getAll(params?: {
    skip?: number
    limit?: number
    publishedOnly?: boolean
  }) {
    const { data } = await axiosInstance.get<CMSPage[]>('/api/cms/pages/', {
      params
    })
    return data
  },

  async getById(id: number) {
    const { data } = await axiosInstance.get<CMSPage>(`/api/cms/pages/${id}`)
    return data
  },

  async getBySlug(slug: string) {
    const { data } = await axiosInstance.get<CMSPage>(`/api/cms/pages/slug/${slug}`)
    return data
  },

  async getHomepage() {
    const { data } = await axiosInstance.get<CMSPage>('/api/cms/pages/homepage')
    return data
  },

  async create(page: CMSPageCreate) {
    const { data } = await axiosInstance.post<CMSPage>('/api/cms/pages/', page)
    return data
  },

  async update(id: number, page: CMSPageUpdate) {
    const { data } = await axiosInstance.put<CMSPage>(`/api/cms/pages/${id}`, page)
    return data
  },

  async delete(id: number) {
    await axiosInstance.delete(`/api/cms/pages/${id}`)
  }
}
