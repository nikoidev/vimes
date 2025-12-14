"use client";

import FileUploader from "@/components/FileUploader";
import Layout from "@/components/Layout";
import { projectsApi } from "@/lib/api/projects";
import uploadsApi, { UploadedFile } from "@/lib/api/uploads";
import { ProjectUpdate } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [uploadedFeaturedImage, setUploadedFeaturedImage] = useState<UploadedFile | null>(null);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [newGalleryImages, setNewGalleryImages] = useState<string[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<UploadedFile | null>(null);

  const [formData, setFormData] = useState<ProjectUpdate>({
    title: "",
    slug: "",
    client_name: "",
    location: "",
    short_description: "",
    description: "",
    challenge: "",
    solution: "",
    results: "",
    featured_image: "",
    gallery: [],
    video_url: "",
    tags: [],
    duration: "",
    completion_date: "",
    is_published: true,
    is_featured: false,
    order: 0,
  });

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoadingData(true);
      const project = await projectsApi.getById(projectId);
      
      setFormData({
        title: project.title,
        slug: project.slug,
        client_name: project.client_name || "",
        location: project.location || "",
        short_description: project.short_description,
        description: project.description || "",
        challenge: project.challenge || "",
        solution: project.solution || "",
        results: project.results || "",
        featured_image: project.featured_image || "",
        gallery: project.gallery || [],
        video_url: project.video_url || "",
        tags: project.tags || [],
        duration: project.duration || "",
        completion_date: project.completion_date || "",
        is_published: project.is_published,
        is_featured: project.is_featured,
        order: project.order,
      });
      
      setExistingGalleryImages(project.gallery || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al cargar proyecto");
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
      setFormData((prev: ProjectUpdate) => ({ ...prev, [name]: checked }));
    } else if (name === "tags") {
      // Convert comma-separated string to array
      const tagsArray = value.split(",").map((tag) => tag.trim()).filter(tag => tag);
      setFormData((prev: ProjectUpdate) => ({ ...prev, tags: tagsArray }));
    } else {
      setFormData((prev: ProjectUpdate) => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData((prev: ProjectUpdate) => ({ ...prev, slug }));
    }
  };

  const handleFeaturedImageUploadSuccess = (file: UploadedFile) => {
    setUploadedFeaturedImage(file);
    const imageUrl = uploadsApi.getFileUrl(file.file_path);
    setFormData((prev: ProjectUpdate) => ({ ...prev, featured_image: imageUrl }));
  };

  const handleGalleryUploadSuccess = (file: UploadedFile) => {
    const imageUrl = uploadsApi.getFileUrl(file.file_path);
    setNewGalleryImages(prev => [...prev, imageUrl]);
  };

  const handleVideoUploadSuccess = (file: UploadedFile) => {
    setUploadedVideo(file);
    const videoUrl = uploadsApi.getFileUrl(file.file_path);
    setFormData((prev: ProjectUpdate) => ({ ...prev, video_url: videoUrl }));
  };

  const handleRemoveExistingImage = (index: number) => {
    const updatedGallery = existingGalleryImages.filter((_, i) => i !== index);
    setExistingGalleryImages(updatedGallery);
  };

  const handleRemoveNewImage = (index: number) => {
    const updatedGallery = newGalleryImages.filter((_, i) => i !== index);
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

      await projectsApi.update(projectId, dataToSubmit);
      router.push("/cms/projects");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al actualizar proyecto");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Cargando proyecto...</div>
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
          <h1 className="text-3xl font-bold">Editar Proyecto</h1>
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
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Título *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Urbanización Residencial Las Colinas"
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
                placeholder="urbanizacion-residencial-las-colinas"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Se genera automáticamente desde el título
              </p>
            </div>

            {/* Client Name */}
            <div>
              <label htmlFor="client_name" className="block text-sm font-medium mb-2">
                Cliente
              </label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                value={formData.client_name || ""}
                onChange={handleChange}
                placeholder="Ej: Constructora ABC"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                placeholder="Ej: Zaragoza, España"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
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
                placeholder="Breve resumen del proyecto en una o dos líneas."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Descripción Completa
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={6}
                placeholder="Descripción detallada del proyecto, incluyendo objetivos, alcance y características principales."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Challenge */}
            <div>
              <label htmlFor="challenge" className="block text-sm font-medium mb-2">
                Desafío
              </label>
              <textarea
                id="challenge"
                name="challenge"
                value={formData.challenge || ""}
                onChange={handleChange}
                rows={4}
                placeholder="¿Cuáles fueron los principales retos o desafíos del proyecto?"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Solution */}
            <div>
              <label htmlFor="solution" className="block text-sm font-medium mb-2">
                Solución
              </label>
              <textarea
                id="solution"
                name="solution"
                value={formData.solution || ""}
                onChange={handleChange}
                rows={4}
                placeholder="¿Cómo se abordaron y resolvieron estos desafíos?"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Results */}
            <div>
              <label htmlFor="results" className="block text-sm font-medium mb-2">
                Resultados
              </label>
              <textarea
                id="results"
                name="results"
                value={formData.results || ""}
                onChange={handleChange}
                rows={4}
                placeholder="¿Qué resultados se obtuvieron? Incluye métricas, beneficios o logros del proyecto."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-2">
                Duración
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration || ""}
                onChange={handleChange}
                placeholder="Ej: 3 meses"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Completion Date */}
            <div>
              <label htmlFor="completion_date" className="block text-sm font-medium mb-2">
                Fecha de Finalización
              </label>
              <input
                type="date"
                id="completion_date"
                name="completion_date"
                value={formData.completion_date || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                Etiquetas
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
                onChange={handleChange}
                placeholder="excavación, urbanización, residencial (separadas por comas)"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separa las etiquetas con comas
              </p>
            </div>

            {/* Featured Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Imagen Destacada
              </label>
              
              {formData.featured_image && (
                <div className="mb-3">
                  <img
                    src={formData.featured_image}
                    alt="Imagen destacada actual"
                    className="h-32 w-auto object-cover rounded border border-gray-300 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Imagen actual. Sube una nueva para reemplazarla.
                  </p>
                </div>
              )}
              
              <FileUploader
                folder="projects"
                onUploadSuccess={handleFeaturedImageUploadSuccess}
                onUploadError={handleUploadError}
                acceptedTypes="image/*"
                maxSize={20}
                showCropper={false}
                showPreview={false}
                aspectRatio={16 / 9}
                targetWidth={1200}
                targetHeight={675}
              />
              {uploadedFeaturedImage && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  ✓ Nueva imagen subida: {uploadedFeaturedImage.original_filename}
                </div>
              )}
            </div>

            {/* Gallery Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Galería de Imágenes
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Sube varias imágenes para mostrar diferentes aspectos del proyecto
              </p>

              {/* Existing Gallery Images */}
              {existingGalleryImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Imágenes Actuales</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {existingGalleryImages.map((imgUrl, idx) => (
                      <div
                        key={`existing-${idx}`}
                        className="relative border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
                      >
                        <div className="flex items-start space-x-2">
                          <img
                            src={imgUrl}
                            alt={`Imagen ${idx + 1}`}
                            className="h-20 w-20 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(idx)}
                              className="w-full px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Gallery Images */}
              {newGalleryImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2 text-green-600 dark:text-green-400">
                    Nuevas Imágenes
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {newGalleryImages.map((imgUrl, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="relative border-2 border-green-300 dark:border-green-600 rounded-lg p-2 bg-green-50 dark:bg-green-900/20"
                      >
                        <div className="flex items-start space-x-2">
                          <img
                            src={imgUrl}
                            alt={`Nueva imagen ${idx + 1}`}
                            className="h-20 w-20 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(idx)}
                              className="w-full px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <FileUploader
                folder="projects"
                onUploadSuccess={handleGalleryUploadSuccess}
                onUploadError={handleUploadError}
                acceptedTypes="image/*"
                maxSize={20}
                showCropper={false}
                showPreview={false}
                aspectRatio={4 / 3}
                targetWidth={1200}
                targetHeight={900}
              />
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Video del Proyecto (Opcional)
              </label>
              
              {formData.video_url && (
                <div className="mb-3">
                  <video
                    src={formData.video_url}
                    controls
                    className="h-32 w-auto rounded border border-gray-300 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Video actual. Sube uno nuevo para reemplazarlo.
                  </p>
                </div>
              )}
              
              <FileUploader
                folder="projects"
                onUploadSuccess={handleVideoUploadSuccess}
                onUploadError={handleUploadError}
                acceptedTypes="video/*"
                maxSize={100}
                showCropper={false}
                showPreview={false}
              />
              {uploadedVideo && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  ✓ Nuevo video subido: {uploadedVideo.original_filename}
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Publicado</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Destacado</span>
              </label>
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
                min="0"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Orden de visualización (menor número = mayor prioridad)
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Actualizando..." : "Actualizar Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
