'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { servicesApi } from '@/lib/api/services'
import { projectsApi } from '@/lib/api/projects'
import { siteConfigApi } from '@/lib/api/site-config'
import { contactApi } from '@/lib/api/contact'
import HeroCarousel from '@/components/HeroCarousel'
import PublicFooter from '@/components/PublicFooter'
import type { Service, Project, SiteConfig, ContactLeadCreate } from '@/types'

export default function PublicHomePage() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<ContactLeadCreate>({
    name: '',
    email: '',
    phone: '',
    message: '',
    service_interest: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [configData, servicesData, projectsData] = await Promise.all([
        siteConfigApi.get().catch(() => null),
        servicesApi.getAll({ active_only: true, featured_only: true }).catch(() => []),
        projectsApi.getAll({ published_only: true, featured_only: true, limit: 3 }).catch(() => []),
      ])
      setConfig(configData)
      setServices(servicesData)
      setProjects(projectsData)
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('sending')

    try {
      await contactApi.create(formData)
      setFormStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        service_interest: '',
      })
      setTimeout(() => setFormStatus('idle'), 5000)
    } catch (err) {
      setFormStatus('error')
      setTimeout(() => setFormStatus('idle'), 5000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Carousel */}
      <HeroCarousel
        companyName={config?.company_name}
        tagline={config?.tagline}
        description={config?.description}
      />

      {/* Services Section */}
      <section id="servicios" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Soluciones profesionales para tus proyectos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/public/services/${service.slug}`}
                className="block group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition h-full">
                  <div className="text-4xl mb-4">🚜</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {service.short_description}
                  </p>
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-orange-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  {service.price_text && (
                    <p className="text-lg font-semibold text-orange-600 dark:text-orange-400 mt-4">
                      {service.price_text}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/public/services"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Ver Todos los Servicios →
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section id="proyectos" className="py-20 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Proyectos Realizados
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Algunos de nuestros trabajos destacados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/public/projects/${project.slug}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition h-full">
                    {project.thumbnail_url && (
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      {project.location && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          📍 {project.location}
                        </p>
                      )}
                      {project.description && (
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                          {project.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/public/projects"
                className="inline-block px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition"
              >
                Ver Todos los Proyectos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contacto" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Contacta con Nosotros
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Solicita presupuesto sin compromiso
              </p>
            </div>

            {formStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-800 dark:text-green-200 rounded-lg">
                ¡Mensaje enviado con éxito! Te contactaremos pronto.
              </div>
            )}

            {formStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 text-red-800 dark:text-red-200 rounded-lg">
                Error al enviar el mensaje. Por favor, inténtalo de nuevo.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Servicio de interés
                </label>
                <select
                  value={formData.service_interest}
                  onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {formStatus === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>

            {/* Contact Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {config?.phone && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="text-3xl mb-2">📞</div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Teléfono</p>
                  <p className="text-gray-600 dark:text-gray-400">{config.phone}</p>
                </div>
              )}
              {config?.email && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="text-3xl mb-2">📧</div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Email</p>
                  <p className="text-gray-600 dark:text-gray-400">{config.email}</p>
                </div>
              )}
              {config?.city && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="text-3xl mb-2">📍</div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Ubicación</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {config.city}, {config.province}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}
