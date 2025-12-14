'use client'

import SafeThemeToggle from '@/components/SafeThemeToggle'
import { projectsApi } from '@/lib/api/projects'
import type { Project } from '@/types'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.slug) {
      loadProject(params.slug as string)
    }
  }, [params.slug])

  const loadProject = async (slug: string) => {
    try {
      setLoading(true)
      const data = await projectsApi.getBySlug(slug)
      setProject(data)
    } catch (err) {
      setError('Proyecto no encontrado')
      console.error('Error loading project:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h1>
          <Link href="/#proyectos" className="text-yellow-600 hover:text-yellow-700">
            Volver a proyectos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
              VIMES
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/#servicios" className="text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium transition-colors">
                Servicios
              </Link>
              <Link href="/#proyectos" className="text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium transition-colors">
                Proyectos
              </Link>
              <Link href="/#contacto" className="text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium transition-colors">
                Contacto
              </Link>
              <SafeThemeToggle />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/#proyectos" className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a proyectos
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl">{project.short_description}</p>
          
          {/* Project Info */}
          <div className="flex flex-wrap gap-6 mt-8 text-white/90">
            {project.client_name && (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Cliente: {project.client_name}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{project.location}</span>
              </div>
            )}
            {project.duration && (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Duración: {project.duration}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {project.tags.map((tag, index) => (
                <span key={index} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              {project.featured_image && (
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      console.error('Error loading project image:', project.featured_image);
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}

              {/* Description */}
              {project.description && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Descripción del Proyecto</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                  </div>
                </div>
              )}

              {/* Challenge */}
              {project.challenge && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-l-4 border-orange-500">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Desafío
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{project.challenge}</p>
                  </div>
                </div>
              )}

              {/* Solution */}
              {project.solution && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-l-4 border-blue-500">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Solución
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{project.solution}</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {project.results && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-l-4 border-green-500">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resultados
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{project.results}</p>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Galería del Proyecto</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.gallery.map((imageUrl, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                        <img
                          src={imageUrl}
                          alt={`${project.title} - Imagen ${index + 1}`}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Error loading gallery image:', imageUrl);
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {project.video_url && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Video del Proyecto</h2>
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <video
                      src={project.video_url}
                      controls
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Details Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detalles del Proyecto</h3>
                <div className="space-y-4">
                  {project.client_name && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                      <p className="text-gray-900 dark:text-white font-medium">{project.client_name}</p>
                    </div>
                  )}
                  {project.location && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
                      <p className="text-gray-900 dark:text-white font-medium">{project.location}</p>
                    </div>
                  )}
                  {project.duration && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duración</p>
                      <p className="text-gray-900 dark:text-white font-medium">{project.duration}</p>
                    </div>
                  )}
                  {project.completion_date && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Finalización</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(project.completion_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4">¿Necesitas un proyecto similar?</h3>
                <p className="mb-6 text-white/90">Contáctanos para discutir tu proyecto y recibir una cotización personalizada.</p>
                <Link
                  href="/#contacto"
                  className="block w-full bg-white text-blue-600 hover:bg-gray-100 text-center font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
                >
                  Contactar Ahora
                </Link>
              </div>

              {/* Share Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Compartir Proyecto</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: project.title,
                          text: project.short_description,
                          url: window.location.href,
                        })
                      }
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2025 VIMES. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
