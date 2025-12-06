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
    const { data } = await axios.get<Project[]>('/api/projects/', { params })
    return data
  },

  getById: async (id: number) => {
    const { data } = await axios.get<Project>(`/api/projects/${id}`)
    return data
  },

  getBySlug: async (slug: string) => {
    const { data } = await axios.get<Project>(`/api/projects/slug/${slug}`)
    return data
  },

  create: async (project: ProjectCreate) => {
    const { data } = await axios.post<Project>('/api/projects/', project)
    return data
  },

  update: async (id: number, project: ProjectUpdate) => {
    const { data } = await axios.put<Project>(`/api/projects/${id}`, project)
    return data
  },

  delete: async (id: number) => {
    await axios.delete(`/api/projects/${id}`)
  },
}

// Export individual functions for convenience
export const getProjects = projectsApi.getAll
export const getProjectById = projectsApi.getById
export const getProjectBySlug = projectsApi.getBySlug
export const createProject = projectsApi.create
export const updateProject = projectsApi.update
export const deleteProject = projectsApi.delete
