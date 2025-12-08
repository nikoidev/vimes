'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { servicesApi } from '@/lib/api/services'
import type { Service } from '@/types'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await servicesApi.getAll({ active_only: true })
      setServices(data)
    } catch (err) {
      console.error('Error cargando servicios:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando servicios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="mb-8">
            <Link
              href="/public"
              className="text-blue-200 hover:text-white transition-colors"
            >
              ← Volver al inicio
            </Link>
          </nav>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Nuestros Servicios</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Ofrecemos una amplia gama de servicios de excavación y construcción con 
            la más alta calidad y profesionalismo.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hay servicios disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/public/services/${service.slug}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  {service.image && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {service.is_featured && (
                        <span className="absolute top-4 right-4 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ⭐ DESTACADO
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h2>

                    {service.short_description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
                        {service.short_description}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      Ver detalles
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
        <div className="mt-16 bg-blue-600 rounded-lg shadow-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contáctanos y cuéntanos sobre tu proyecto. Estamos aquí para ayudarte.
          </p>
          <Link
            href="/public#contact"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg"
          >
            Solicitar Presupuesto
          </Link>
        </div>
      </div>
    </div>
  )
}
