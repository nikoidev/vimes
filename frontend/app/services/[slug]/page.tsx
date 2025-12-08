'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SafeThemeToggle from '@/components/SafeThemeToggle'
import { servicesApi } from '@/lib/api/services'
import type { Service } from '@/types'

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.slug) {
      loadService(params.slug as string)
    }
  }, [params.slug])

  const loadService = async (slug: string) => {
    try {
      setLoading(true)
      const data = await servicesApi.getBySlug(slug)
      setService(data)
    } catch (err) {
      setError('Servicio no encontrado')
      console.error('Error loading service:', err)
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

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h1>
          <Link href="/#servicios" className="text-yellow-600 hover:text-yellow-700">
            Volver a servicios
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
      <section className="relative bg-gradient-to-br from-yellow-500 to-yellow-700 dark:from-yellow-600 dark:to-yellow-800 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/#servicios" className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a servicios
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{service.title}</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl">{service.short_description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              {service.image && (
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${service.image}`}
                    alt={service.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}

              {/* Description */}
              {service.description && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Descripción del Servicio</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{service.description}</p>
                  </div>
                </div>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Características</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gallery */}
              {service.gallery && service.gallery.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Galería</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.gallery.map((imageUrl, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                          alt={`${service.title} - Imagen ${index + 1}`}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              {service.price_text && (
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-8 text-white shadow-xl">
                  <h3 className="text-lg font-semibold mb-2">Precio</h3>
                  <p className="text-3xl font-bold">{service.price_text}</p>
                </div>
              )}

              {/* Contact Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">¿Interesado en este servicio?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Contáctanos para más información y cotizaciones personalizadas.</p>
                <Link
                  href="/#contacto"
                  className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
                >
                  Solicitar Cotización
                </Link>
              </div>

              {/* Other Services */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Otros Servicios</h3>
                <Link
                  href="/#servicios"
                  className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center"
                >
                  Ver todos los servicios
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
