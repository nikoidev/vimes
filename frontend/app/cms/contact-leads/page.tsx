'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { contactApi } from '@/lib/api/contact'
import type { ContactLead } from '@/types'

export default function ContactLeadsPage() {
  const [leads, setLeads] = useState<ContactLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread' | 'new'>('all')

  useEffect(() => {
    fetchLeads()
    fetchUnreadCount()
  }, [filter])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filter === 'unread') params.unread_only = true
      if (filter === 'new') params.status = 'new'
      
      const data = await contactApi.getAll(params)
      setLeads(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar leads')
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const { count } = await contactApi.getUnreadCount()
      setUnreadCount(count)
    } catch (err) {
      console.error('Error al obtener contador de no leídos')
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await contactApi.markAsRead(id)
      setLeads(leads.map((l) => (l.id === id ? { ...l, is_read: true } : l)))
      fetchUnreadCount()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al marcar como leído')
    }
  }

  const handleUpdateStatus = async (id: number, status: ContactLead['status']) => {
    try {
      const updated = await contactApi.update(id, { status })
      setLeads(leads.map((l) => (l.id === id ? updated : l)))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al actualizar estado')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este lead?')) return

    try {
      await contactApi.delete(id)
      setLeads(leads.filter((l) => l.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al eliminar lead')
    }
  }

  const getStatusColor = (status: ContactLead['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    }
    return colors[status] || colors.new
  }

  const getStatusLabel = (status: ContactLead['status']) => {
    const labels = {
      new: 'Nuevo',
      contacted: 'Contactado',
      in_progress: 'En proceso',
      completed: 'Completado',
      rejected: 'Rechazado',
    }
    return labels[status] || status
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
            <h1 className="text-3xl font-bold">Mensajes de Contacto</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  {unreadCount} sin leer
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              No leídos
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'new'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Nuevos
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
                !lead.is_read ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {lead.name}
                    </h3>
                    {!lead.is_read && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        No leído
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>📧 {lead.email}</p>
                    {lead.phone && <p>📱 {lead.phone}</p>}
                    {lead.location && <p>📍 {lead.location}</p>}
                    {lead.service_interest && (
                      <p>🔧 Interés: {lead.service_interest}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleUpdateStatus(lead.id, e.target.value as ContactLead['status'])
                    }
                    className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="in_progress">En proceso</option>
                    <option value="completed">Completado</option>
                    <option value="rejected">Rechazado</option>
                  </select>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(lead.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>

              {lead.subject && (
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Asunto: {lead.subject}
                </p>
              )}

              <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                {lead.message}
              </p>

              <div className="flex justify-end gap-2">
                {!lead.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(lead.id)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 text-sm"
                  >
                    Marcar como leído
                  </button>
                )}
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {leads.length === 0 && !loading && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No hay mensajes de contacto
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
