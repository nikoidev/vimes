'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { servicesApi } from '@/lib/api/services'
import type { Service } from '@/types'

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await servicesApi.getAll()
      setServices(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar servicios')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return

    try {
      await servicesApi.delete(id)
      setServices(services.filter((s) => s.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al eliminar servicio')
    }
  }

  const toggleActive = async (service: Service) => {
    try {
      const updated = await servicesApi.update(service.id, {
        is_active: !service.is_active,
      })
      setServices(services.map((s) => (s.id === service.id ? updated : s)))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al actualizar servicio')
    }
  }

  const toggleFeatured = async (service: Service) => {
    try {
      const updated = await servicesApi.update(service.id, {
        is_featured: !service.is_featured,
      })
      setServices(services.map((s) => (s.id === service.id ? updated : s)))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al actualizar servicio')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Cargando...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Servicios</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestiona los servicios de excavación
            </p>
          </div>
          <button
            onClick={() => router.push('/cms/services/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nuevo Servicio
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Destacado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {service.title}
                      </div>
                      {service.short_description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                          {service.short_description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {service.slug}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(service)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        service.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {service.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeatured(service)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        service.is_featured
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {service.is_featured ? '⭐ Destacado' : 'Normal'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {service.order}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => router.push(`/cms/services/${service.id}`)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {services.length === 0 && !loading && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No hay servicios creados aún
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
