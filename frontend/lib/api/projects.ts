import axios from '../axios'
import type { Project, ProjectCreate, ProjectUpdate } from '@/types'

export const projectsApi = {
  getAll: async (params?: {
    skip?: number
    limit?: number
    published_only?: boolean
    featured_only?: boolean
    service_id?: number
  }) => {
    const { data } = await axios.get<Project[]>('/projects/', { params })
    return data
  },

  getById: async (id: number) => {
    const { data } = await axios.get<Project>(`/projects/${id}`)
    return data
  },

  getBySlug: async (slug: string) => {
    const { data } = await axios.get<Project>(`/projects/slug/${slug}`)
    return data
  },

  create: async (project: ProjectCreate) => {
    const { data } = await axios.post<Project>('/projects/', project)
    return data
  },

  update: async (id: number, project: ProjectUpdate) => {
    const { data } = await axios.put<Project>(`/projects/${id}`, project)
    return data
  },

  delete: async (id: number) => {
    await axios.delete(`/projects/${id}`)
  },
}
