'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { testimonialsApi } from '@/lib/api/testimonials'
import type { Testimonial } from '@/types'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const data = await testimonialsApi.getAll({ published_only: true })
      setTestimonials(data)
    } catch (err) {
      console.error('Error cargando testimonios:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating}.0
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando testimonios...</p>
        </div>
      </div>
    )
  }

  // Calcular estadísticas
  const avgRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 0
  const totalTestimonials = testimonials.length

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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Lo que Dicen Nuestros Clientes
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mb-8">
            La satisfacción de nuestros clientes es nuestra mayor recompensa. 
            Lee lo que tienen que decir sobre su experiencia con nosotros.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <div className="bg-blue-700 bg-opacity-50 rounded-lg px-6 py-4">
              <div className="text-4xl font-bold">{totalTestimonials}</div>
              <div className="text-blue-100">Testimonios</div>
            </div>
            <div className="bg-blue-700 bg-opacity-50 rounded-lg px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{avgRating.toFixed(1)}</span>
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-blue-100">Valoración Promedio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hay testimonios disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col"
              >
                {/* Rating */}
                <div className="mb-4">{renderStars(testimonial.rating)}</div>

                {/* Testimonial */}
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 flex-1 italic">
                  "{testimonial.testimonial}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {testimonial.photo_url ? (
                    <img
                      src={testimonial.photo_url}
                      alt={testimonial.client_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.client_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.client_name}
                    </div>
                    {testimonial.client_position && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.client_position}
                      </div>
                    )}
                    {testimonial.project_title && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Proyecto: {testimonial.project_title}
                      </div>
                    )}
                  </div>
                </div>

                {/* Featured Badge */}
                {testimonial.is_featured && (
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      ⭐ Destacado
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 rounded-lg shadow-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Quieres formar parte de nuestros casos de éxito?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a la lista de clientes satisfechos. Contáctanos y cuéntanos sobre tu proyecto.
          </p>
          <Link
            href="/public#contact"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg"
          >
            Empezar Ahora
          </Link>
        </div>
      </div>
    </div>
  )
}
