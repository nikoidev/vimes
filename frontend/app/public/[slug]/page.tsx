'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cmsPagesApi } from '@/lib/api/cms-pages'
import type { CMSPage } from '@/types'

export default function DynamicCMSPage({ params }: { params: { slug: string } }) {
  const [page, setPage] = useState<CMSPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPage()
  }, [params.slug])

  const fetchPage = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener todas las páginas y buscar por slug
      const pages = await cmsPagesApi.getAll({ publishedOnly: true })
      const foundPage = pages.find((p: CMSPage) => p.slug === params.slug)

      if (!foundPage) {
        setError('Página no encontrada')
        return
      }

      setPage(foundPage)
    } catch (err) {
      console.error('Error cargando página:', err)
      setError('Error al cargar la página')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Página no encontrada'}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="mb-8">
            <Link
              href="/public"
              className="text-blue-200 hover:text-white transition-colors"
            >
              ← Volver al inicio
            </Link>
          </nav>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{page.title}</h1>
          {page.meta_description && (
            <p className="text-xl text-blue-100 max-w-3xl">
              {page.meta_description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 md:p-12">
          {/* Content */}
          <div
            className="prose dark:prose-invert max-w-none prose-lg
                       prose-headings:text-gray-900 dark:prose-headings:text-white
                       prose-p:text-gray-700 dark:prose-p:text-gray-300
                       prose-a:text-blue-600 dark:prose-a:text-blue-400
                       prose-strong:text-gray-900 dark:prose-strong:text-white
                       prose-img:rounded-lg prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />

          {/* Metadata Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex flex-wrap gap-4">
              {page.created_at && (
                <span>
                  📅 Publicado:{' '}
                  {new Date(page.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
              {page.updated_at && page.updated_at !== page.created_at && (
                <span>
                  🔄 Actualizado:{' '}
                  {new Date(page.updated_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-8 bg-blue-600 rounded-lg shadow-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas más información?</h2>
          <p className="text-blue-100 mb-6">
            Estamos aquí para ayudarte. No dudes en contactarnos.
          </p>
          <Link
            href="/public#contact"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  )
}
