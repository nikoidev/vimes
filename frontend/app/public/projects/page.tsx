'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { projectsApi } from '@/lib/api/projects'
import { servicesApi } from '@/lib/api/services'
import type { Project, Service } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [selectedService])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [projectsData, servicesData] = await Promise.all([
        projectsApi.getAll({ published_only: true }),
        servicesApi.getAll({ active_only: true }),
      ])
      setProjects(projectsData)
      setServices(servicesData)
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = async () => {
    try {
      const filters: any = { published_only: true }
      if (selectedService) {
        filters.service_id = selectedService
      }
      const data = await projectsApi.getAll(filters)
      setProjects(data)
    } catch (err) {
      console.error('Error filtrando proyectos:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando proyectos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="mb-8">
            <Link
              href="/public"
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← Volver al inicio
            </Link>
          </nav>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Nuestros Proyectos</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Descubre algunos de nuestros trabajos más destacados. Cada proyecto 
            refleja nuestro compromiso con la excelencia y la satisfacción del cliente.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Filtrar por:
            </span>
            <button
              onClick={() => setSelectedService(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedService === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedService === service.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {selectedService
                ? 'No hay proyectos disponibles para este servicio.'
                : 'No hay proyectos disponibles en este momento.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/public/projects/${project.slug}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                        <svg
                          className="w-16 h-16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {project.is_featured && (
                      <span className="absolute top-4 right-4 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⭐ DESTACADO
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {project.location && (
                        <span className="flex items-center">
                          📍 {project.location}
                        </span>
                      )}
                      {project.completion_date && (
                        <span className="flex items-center">
                          📅{' '}
                          {new Date(project.completion_date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                        {project.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                    )}

                    {/* CTA */}
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      Ver proyecto completo
                      <svg
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Tienes un proyecto en mente?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Estamos listos para hacer realidad tu proyecto. Contáctanos hoy mismo.
          </p>
          <Link
            href="/public#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
          >
            Iniciar Conversación
          </Link>
        </div>
      </div>
    </div>
  )
}
