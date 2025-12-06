'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { projectsApi } from '@/lib/api/projects'
import type { Project } from '@/types'

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await projectsApi.getAll()
      setProjects(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar proyectos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return

    try {
      await projectsApi.delete(id)
      setProjects(projects.filter((p) => p.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al eliminar proyecto')
    }
  }

  const togglePublished = async (project: Project) => {
    try {
      const updated = await projectsApi.update(project.id, {
        is_published: !project.is_published,
      })
      setProjects(projects.map((p) => (p.id === project.id ? updated : p)))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al actualizar proyecto')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Cargando...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Proyectos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestiona el portfolio de proyectos realizados
            </p>
          </div>
          <button
            onClick={() => router.push('/cms/projects/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nuevo Proyecto
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              {project.featured_image && (
                <div className="h-48 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {project.title}
                  </h3>
                  <div className="flex gap-1">
                    {project.is_featured && <span className="text-yellow-500">⭐</span>}
                    {project.is_published ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-gray-400">○</span>
                    )}
                  </div>
                </div>
                {project.location && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    📍 {project.location}
                  </p>
                )}
                {project.short_description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {project.short_description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => togglePublished(project)}
                    className={`text-xs px-2 py-1 rounded ${
                      project.is_published
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {project.is_published ? 'Publicado' : 'Borrador'}
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={() => router.push(`/cms/projects/${project.id}`)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No hay proyectos creados aún
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
