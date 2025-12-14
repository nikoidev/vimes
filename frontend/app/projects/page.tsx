'use client'

import SafeThemeToggle from '@/components/SafeThemeToggle'
import { projectsApi } from '@/lib/api/projects'
import type { Project } from '@/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectsApi.getAll()
      const publishedProjects = data.filter((project: Project) => project.is_published)
      setProjects(publishedProjects)
      
      // Extract all unique tags
      const tags = new Set<string>()
      publishedProjects.forEach((project: Project) => {
        if (project.tags && Array.isArray(project.tags)) {
          project.tags.forEach(tag => tags.add(tag))
        }
      })
      setAllTags(Array.from(tags))
    } catch (err) {
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = selectedTag === 'all' 
    ? projects 
    : projects.filter(project => 
        project.tags && Array.isArray(project.tags) && project.tags.includes(selectedTag)
      )

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
              <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium transition-colors">
                Servicios
              </Link>
              <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
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
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Nuestros Proyectos</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
            Descubre los proyectos exitosos que hemos completado para nuestros clientes
          </p>
        </div>
      </section>

      {/* Filters */}
      {allTags.length > 0 && (
        <section className="py-8 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedTag === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Todos ({projects.length})
              </button>
              {allTags.map((tag) => {
                const count = projects.filter(p => p.tags?.includes(tag)).length
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {selectedTag === 'all' 
                  ? 'No hay proyectos disponibles en este momento.' 
                  : `No hay proyectos con la etiqueta "${selectedTag}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Project Image */}
                  {project.featured_image && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-project.jpg'
                        }}
                      />
                      {project.is_featured && (
                        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Destacado
                        </div>
                      )}
                    </div>
                  )}

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* Client & Location */}
                    <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {project.client_name && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {project.client_name}
                        </span>
                      )}
                      {project.location && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {project.location}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {project.short_description}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-500 px-2 py-1">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Duration */}
                    {project.duration && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Duración: {project.duration}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      Ver proyecto completo
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para iniciar tu proyecto?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contáctanos y cuéntanos sobre tu proyecto. Nos encantaría trabajar contigo
          </p>
          <Link
            href="/#contacto"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg text-lg"
          >
            Iniciar Conversación
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                VIMES
              </h3>
              <p className="text-gray-400">
                Soluciones profesionales de excavación y movimiento de tierra
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Navegación</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">
                    Proyectos
                  </Link>
                </li>
                <li>
                  <Link href="/#contacto" className="text-gray-400 hover:text-white transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400">
                Email: info@vimes.com<br />
                Teléfono: +34 123 456 789
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; 2025 VIMES. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
