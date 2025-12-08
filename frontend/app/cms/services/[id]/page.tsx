"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/Layout";
import { servicesApi } from "@/lib/api/services";
import { ServiceUpdate, GalleryImage } from "@/types";
import FileUploader from "@/components/FileUploader";
import uploadsApi, { UploadedFile } from "@/lib/api/uploads";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [uploadedImage, setUploadedImage] = useState<UploadedFile | null>(null);
  const [existingGalleryImages, setExistingGalleryImages] = useState<GalleryImage[]>([]);
  const [newGalleryImages, setNewGalleryImages] = useState<GalleryImage[]>([]);
  const [currentDescription, setCurrentDescription] = useState("");

  const [formData, setFormData] = useState<ServiceUpdate>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    icon: "",
    image: "",
    gallery: [],
    is_active: true,
    is_featured: false,
    order: 0,
  });

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoadingData(true);
      const service = await servicesApi.getById(serviceId);
      
      setFormData({
        title: service.title,
        slug: service.slug,
        short_description: service.short_description,
        description: service.description || "",
        icon: service.icon || "",
        image: service.image || "",
        gallery: service.gallery || [],
        is_active: service.is_active,
        is_featured: service.is_featured,
        order: service.order,
      });
      
      setExistingGalleryImages(service.gallery || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al cargar servicio");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: ServiceUpdate) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: ServiceUpdate) => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData((prev: ServiceUpdate) => ({ ...prev, slug }));
    }
  };

  const handleUploadSuccess = (file: UploadedFile) => {
    setUploadedImage(file);
    const imageUrl = uploadsApi.getFileUrl(file.file_path);
    setFormData((prev: ServiceUpdate) => ({ ...prev, image: imageUrl }));
  };

  const handleGalleryUploadSuccess = (file: UploadedFile) => {
    const imageUrl = uploadsApi.getFileUrl(file.file_path);
    const newGalleryImage: GalleryImage = {
      url: imageUrl,
      description: currentDescription || "",
    };
    const updatedNewGallery = [...newGalleryImages, newGalleryImage];
    setNewGalleryImages(updatedNewGallery);
    setCurrentDescription(""); // Reset description input
  };

  const handleRemoveExistingImage = (index: number) => {
    const updatedGallery = existingGalleryImages.filter((_, i) => i !== index);
    setExistingGalleryImages(updatedGallery);
  };

  const handleRemoveNewImage = (index: number) => {
    const updatedGallery = newGalleryImages.filter((_, i) => i !== index);
    setNewGalleryImages(updatedGallery);
  };

  const handleUpdateExistingImageDescription = (index: number, description: string) => {
    const updatedGallery = existingGalleryImages.map((img, i) =>
      i === index ? { ...img, description } : img
    );
    setExistingGalleryImages(updatedGallery);
  };

  const handleUpdateNewImageDescription = (index: number, description: string) => {
    const updatedGallery = newGalleryImages.map((img, i) =>
      i === index ? { ...img, description } : img
    );
    setNewGalleryImages(updatedGallery);
  };

  const handleUploadError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Merge existing and new gallery images
      const allGalleryImages = [...existingGalleryImages, ...newGalleryImages];
      
      const dataToSubmit = {
        ...formData,
        gallery: allGalleryImages,
      };

      await servicesApi.update(serviceId, dataToSubmit);
      router.push("/cms/services");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al actualizar servicio");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Cargando servicio...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold">Editar Servicio</h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2"
              >
                Título *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Excavaciones y Movimiento de Tierra"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="excavaciones-y-movimiento-de-tierra"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Se genera automáticamente desde el título
              </p>
            </div>

            {/* Short Description */}
            <div>
              <label
                htmlFor="short_description"
                className="block text-sm font-medium mb-2"
              >
                Descripción Corta *
              </label>
              <textarea
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Servicios profesionales de excavación con maquinaria de última generación para todo tipo de proyectos."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Descripción Completa
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={6}
                placeholder="Ofrecemos servicios integrales de excavación y movimiento de tierra para proyectos residenciales, comerciales e industriales. Contamos con maquinaria moderna y un equipo de operadores altamente capacitados que garantizan trabajos eficientes y seguros. Nuestros servicios incluyen: nivelación de terrenos, excavación para cimientos, apertura de zanjas, rellenos compactados y más."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Featured Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Imagen Destacada
              </label>
              
              {formData.image && (
                <div className="mb-3 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 max-w-md">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${formData.image}`}
                    alt="Current"
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: '4/3' }}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 bg-gray-50 dark:bg-gray-900">
                    Imagen actual
                  </p>
                </div>
              )}
              
              <FileUploader
                folder="services"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                acceptedTypes="image/*"
                maxSize={20}
                showCropper={true}
                aspectRatio={4 / 3}
                targetWidth={800}
                targetHeight={600}
              />
              {uploadedImage && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  ✓ Nueva imagen subida: {uploadedImage.original_filename}
                </div>
              )}
            </div>

            {/* Gallery Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Galería de Imágenes (opcional)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Agrega múltiples imágenes con descripciones para mostrar en la página de detalle del servicio
              </p>

              {/* Existing Gallery Images */}
              {existingGalleryImages.length > 0 && (
                <div className="mb-6 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Imágenes actuales ({existingGalleryImages.length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {existingGalleryImages.map((galleryImage, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative group bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border dark:border-gray-700"
                      >
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${galleryImage.url}`}
                          alt={galleryImage.description || `Imagen ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3 space-y-2">
                          <input
                            type="text"
                            value={galleryImage.description || ""}
                            onChange={(e) => handleUpdateExistingImageDescription(index, e.target.value)}
                            placeholder="Descripción de la imagen"
                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(index)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description input before upload */}
              <div className="mb-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">
                  Agregar nueva imagen a la galería
                </label>
                <label className="block text-sm mb-2">
                  Descripción de la próxima imagen (opcional)
                </label>
                <input
                  type="text"
                  value={currentDescription}
                  onChange={(e) => setCurrentDescription(e.target.value)}
                  placeholder="Ej: Excavadora realizando trabajos de nivelación"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <FileUploader
                folder="services"
                onUploadSuccess={handleGalleryUploadSuccess}
                onUploadError={handleUploadError}
                acceptedTypes="image/*"
                maxSize={20}
                showCropper={true}
                aspectRatio={4 / 3}
                targetWidth={800}
                targetHeight={600}
              />

              {/* New Gallery Preview Grid */}
              {newGalleryImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✓ {newGalleryImages.length} imagen(es) nueva(s)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newGalleryImages.map((galleryImage, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative group bg-green-50 dark:bg-green-900/20 rounded-lg overflow-hidden border border-green-300 dark:border-green-700"
                      >
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          Nueva
                        </div>
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${galleryImage.url}`}
                          alt={galleryImage.description || `Nueva imagen ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3 space-y-2">
                          <input
                            type="text"
                            value={galleryImage.description || ""}
                            onChange={(e) => handleUpdateNewImageDescription(index, e.target.value)}
                            placeholder="Descripción de la imagen"
                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order */}
            <div>
              <label htmlFor="order" className="block text-sm font-medium mb-2">
                Orden
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                placeholder="1"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Orden de aparición en la web (menor número = primera posición)
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Activo</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Destacado</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Actualizar Servicio"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
