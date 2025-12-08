'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { servicesApi } from '@/lib/api/services'
import { projectsApi } from '@/lib/api/projects'
import type { Service, Project } from '@/types'

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServiceData()
  }, [params.slug])

  const fetchServiceData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener todos los servicios y buscar por slug
      const services = await servicesApi.getAll({ active_only: true })
      const foundService = services.find((s: Service) => s.slug === params.slug)

      if (!foundService) {
        setError('Servicio no encontrado')
        return
      }

      setService(foundService)

      // Obtener proyectos relacionados a este servicio
      if (foundService.id) {
        const projects = await projectsApi.getAll({
          published_only: true,
          service_id: foundService.id,
        })
        setRelatedProjects(projects.slice(0, 6))
      }
    } catch (err) {
      console.error('Error cargando servicio:', err)
      setError('Error al cargar el servicio')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando servicio...</p>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Servicio no encontrado'}
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="mb-8">
            <Link
              href="/public"
              className="text-blue-200 hover:text-white transition-colors"
            >
              ← Volver al inicio
            </Link>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
          {service.short_description && (
            <p className="text-xl text-blue-100 max-w-3xl">
              {service.short_description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            {service.image && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Descripción del Servicio
              </h2>
              <div
                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Proyectos Relacionados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/public/projects/${project.slug}`}
                      className="group"
                    >
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                        {project.thumbnail_url && (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h3>
                          {project.location && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              📍 {project.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* CTA Card */}
            <div className="bg-blue-600 text-white rounded-lg shadow-lg p-6 mb-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">¿Necesitas este servicio?</h3>
              <p className="mb-6 text-blue-100">
                Contáctanos para obtener un presupuesto personalizado sin compromiso.
              </p>
              <Link
                href="/public#contact"
                className="block w-full bg-white text-blue-600 text-center font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Solicitar Presupuesto
              </Link>
            </div>

            {/* Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Información
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-600 dark:text-gray-400 w-24 flex-shrink-0">
                    Estado:
                  </span>
                  <span className={`font-semibold ${
                    service.is_active
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {service.is_active ? 'Activo' : 'No disponible'}
                  </span>
                </div>
                {service.is_featured && (
                  <div className="flex items-start">
                    <span className="text-gray-600 dark:text-gray-400 w-24 flex-shrink-0">
                      Destacado:
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      ⭐ Sí
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Other Services */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Otros Servicios
              </h3>
              <Link
                href="/public/services"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                Ver todos los servicios →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
