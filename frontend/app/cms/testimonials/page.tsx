'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, type Testimonial, type TestimonialCreate } from '@/lib/api/testimonials'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState<TestimonialCreate>({
    client_name: '',
    client_position: '',
    client_company: '',
    client_location: '',
    testimonial: '',
    rating: 5,
    client_photo: '',
    is_published: true,
    is_featured: false,
    order: 1
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const data = await getTestimonials({ published_only: false })
      setTestimonials(data.sort((a: Testimonial, b: Testimonial) => a.order - b.order))
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, formData)
      } else {
        await createTestimonial(formData)
      }
      setShowModal(false)
      resetForm()
      loadTestimonials()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      alert('Error al guardar el testimonio')
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      client_name: testimonial.client_name,
      client_position: testimonial.client_position || '',
      client_company: testimonial.client_company || '',
      client_location: testimonial.client_location || '',
      testimonial: testimonial.testimonial,
      rating: testimonial.rating,
      client_photo: testimonial.client_photo || '',
      is_published: testimonial.is_published,
      is_featured: testimonial.is_featured,
      order: testimonial.order
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este testimonio?')) return
    
    try {
      await deleteTestimonial(id)
      loadTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      alert('Error al eliminar el testimonio')
    }
  }

  const resetForm = () => {
    setEditingTestimonial(null)
    setFormData({
      client_name: '',
      client_position: '',
      client_company: '',
      client_location: '',
      testimonial: '',
      rating: 5,
      client_photo: '',
      is_published: true,
      is_featured: false,
      order: testimonials.length + 1
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonios</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona las opiniones de tus clientes</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            + Nuevo Testimonio
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4 mb-4">
                  {testimonial.client_photo ? (
                    <img
                      src={testimonial.client_photo}
                      alt={testimonial.client_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.client_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{testimonial.client_name}</h3>
                    {testimonial.client_position && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.client_position}</p>
                    )}
                    {testimonial.client_company && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.client_company}</p>
                    )}
                    {testimonial.client_location && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">{testimonial.client_location}</p>
                    )}
                    <div className="mt-2">{renderStars(testimonial.rating)}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      testimonial.is_published 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {testimonial.is_published ? 'Publicado' : 'Borrador'}
                    </span>
                    {testimonial.is_featured && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
                        Destacado
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white text-center">
                      #{testimonial.order}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.testimonial}"</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {testimonials.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-lg">No hay testimonios</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              Agregar el primer testimonio
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingTestimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Cargo/Posición
                    </label>
                    <input
                      type="text"
                      value={formData.client_position}
                      onChange={(e) => setFormData({ ...formData, client_position: e.target.value })}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white"
                      placeholder="Propietario"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.client_company}
                      onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white"
                      placeholder="Finca Los Olivos"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.client_location}
                    onChange={(e) => setFormData({ ...formData, client_location: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white"
                    placeholder="Maella, Zaragoza"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Testimonio *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.testimonial}
                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white"
                    placeholder="Excelente servicio, muy profesionales..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Foto del Cliente (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.client_photo}
                    onChange={(e) => setFormData({ ...formData, client_photo: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white"
                    placeholder="https://..."
                  />
                  {formData.client_photo && (
                    <div className="mt-2">
                      <img src={formData.client_photo} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Valoración
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.5"
                      required
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Orden
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.is_published ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.value === 'true' })}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white"
                    >
                      <option value="true">Publicado</option>
                      <option value="false">Borrador</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Marcar como destacado
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    {editingTestimonial ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
