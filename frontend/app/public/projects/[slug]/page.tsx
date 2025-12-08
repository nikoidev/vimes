'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { projectsApi } from '@/lib/api/projects'
import { servicesApi } from '@/lib/api/services'
import type { Project, Service } from '@/types'

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    fetchProjectData()
  }, [params.slug])

  const fetchProjectData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener todos los proyectos y buscar por slug
      const projects = await projectsApi.getAll({ published_only: true })
      const foundProject = projects.find((p: Project) => p.slug === params.slug)

      if (!foundProject) {
        setError('Proyecto no encontrado')
        return
      }

      setProject(foundProject)

      // Establecer primera imagen como seleccionada
      if (foundProject.images && foundProject.images.length > 0) {
        setSelectedImage(foundProject.images[0])
      } else if (foundProject.thumbnail_url) {
        setSelectedImage(foundProject.thumbnail_url)
      }

      // Obtener servicio relacionado
      if (foundProject.service_id) {
        const services = await servicesApi.getAll({ active_only: true })
        const relatedService = services.find((s: Service) => s.id === foundProject.service_id)
        if (relatedService) setService(relatedService)
      }
    } catch (err) {
      console.error('Error cargando proyecto:', err)
      setError('Error al cargar el proyecto')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando proyecto...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Proyecto no encontrado'}
          </h1>
          <Link
            href="/public"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const allImages = [
    ...(project.thumbnail_url ? [project.thumbnail_url] : []),
    ...(project.images || []),
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="mb-8">
            <Link
              href="/public"
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← Volver al inicio
            </Link>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
            {project.is_featured && (
              <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                ⭐ DESTACADO
              </span>
            )}
          </div>

          {project.description && (
            <p className="text-xl text-gray-300 max-w-3xl mb-4">
              {project.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            {project.location && (
              <span className="bg-gray-700 px-4 py-2 rounded-full">
                📍 {project.location}
              </span>
            )}
            {project.completion_date && (
              <span className="bg-gray-700 px-4 py-2 rounded-full">
                📅 {new Date(project.completion_date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            )}
            {service && (
              <Link
                href={`/public/services/${service.slug}`}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors"
              >
                🔧 {service.title}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            {selectedImage && (
              <div className="mb-6 rounded-lg overflow-hidden shadow-xl">
                <img
                  src={selectedImage}
                  alt={project.title}
                  className="w-full h-96 md:h-[600px] object-cover"
                />
              </div>
            )}

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-8">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow ${
                      selectedImage === img ? 'ring-4 ring-blue-600' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${project.title} - Imagen ${index + 1}`}
                      className="w-full h-20 object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Descripción del Proyecto
              </h2>
              <div
                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: project.description || '' }}
              />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Project Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Detalles del Proyecto
              </h3>
              <div className="space-y-4">
                {project.client_name && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Cliente
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {project.client_name}
                    </span>
                  </div>
                )}

                {project.location && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Ubicación
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {project.location}
                    </span>
                  </div>
                )}

                {project.completion_date && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Fecha de Finalización
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(project.completion_date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {service && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Servicio
                    </span>
                    <Link
                      href={`/public/services/${service.slug}`}
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {service.title} →
                    </Link>
                  </div>
                )}

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    Estado
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    project.is_published
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {project.is_published ? '✓ Completado' : 'En proceso'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/public#contact"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-lg transition-colors"
                >
                  Solicitar Presupuesto
                </Link>
              </div>
            </div>

            {/* Other Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Más Proyectos
              </h3>
              <Link
                href="/public/projects"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                Ver todos los proyectos →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
