import axios from '../axios'
import type { ContactLead, ContactLeadCreate, ContactLeadUpdate } from '@/types'

export const contactApi = {
  create: async (lead: ContactLeadCreate) => {
    const { data } = await axios.post<ContactLead>('/api/contact/', lead)
    return data
  },

  getAll: async (params?: {
    skip?: number
    limit?: number
    status?: string
    unread_only?: boolean
  }) => {
    const { data } = await axios.get<ContactLead[]>('/api/contact/', { params })
    return data
  },

  getById: async (id: number) => {
    const { data } = await axios.get<ContactLead>(`/api/contact/${id}`)
    return data
  },

  update: async (id: number, lead: ContactLeadUpdate) => {
    const { data } = await axios.put<ContactLead>(`/api/contact/${id}`, lead)
    return data
  },

  markAsRead: async (id: number) => {
    const { data } = await axios.patch<ContactLead>(`/api/contact/${id}/read`)
    return data
  },

  getUnreadCount: async () => {
    const { data } = await axios.get<{ count: number }>('/api/contact/unread-count')
    return data
  },

  delete: async (id: number) => {
    await axios.delete(`/api/contact/${id}`)
  },
}

// Export individual functions for convenience
export const createContactLead = contactApi.create
export const getContactLeads = contactApi.getAll
export const getContactLeadById = contactApi.getById
export const updateContactLead = contactApi.update
export const markContactAsRead = contactApi.markAsRead
export const getUnreadContactCount = contactApi.getUnreadCount
export const deleteContactLead = contactApi.delete
