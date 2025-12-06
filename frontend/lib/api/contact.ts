import axios from '../axios'
import type { ContactLead, ContactLeadCreate, ContactLeadUpdate } from '@/types'

export const contactApi = {
  create: async (lead: ContactLeadCreate) => {
    const { data } = await axios.post<ContactLead>('/contact/', lead)
    return data
  },

  getAll: async (params?: {
    skip?: number
    limit?: number
    status?: string
    unread_only?: boolean
  }) => {
    const { data } = await axios.get<ContactLead[]>('/contact/', { params })
    return data
  },

  getById: async (id: number) => {
    const { data } = await axios.get<ContactLead>(`/contact/${id}`)
    return data
  },

  update: async (id: number, lead: ContactLeadUpdate) => {
    const { data } = await axios.put<ContactLead>(`/contact/${id}`, lead)
    return data
  },

  markAsRead: async (id: number) => {
    const { data } = await axios.patch<ContactLead>(`/contact/${id}/read`)
    return data
  },

  getUnreadCount: async () => {
    const { data } = await axios.get<{ count: number }>('/contact/unread-count')
    return data
  },

  delete: async (id: number) => {
    await axios.delete(`/contact/${id}`)
  },
}
