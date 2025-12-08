"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { projectsApi } from "@/lib/api/projects";
import { ProjectCreate } from "@/types";
import FileUploader from "@/components/FileUploader";
import uploadsApi, { UploadedFile } from "@/lib/api/uploads";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<UploadedFile | null>(null);

  const [formData, setFormData] = useState<ProjectCreate>({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: ProjectCreate) => ({ ...prev, [name]: checked }));
    } else if (name === "tags") {
      // Convert comma-separated string to array
      const tagsArray = value.split(",").map((tag) => tag.trim());
      setFormData((prev: ProjectCreate) => ({ ...prev, tags: tagsArray }));
    } else {
      setFormData((prev: ProjectCreate) => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData((prev: ProjectCreate) => ({ ...prev, slug }));
    }
  };

  const handleImageUploadSuccess = (file: UploadedFile) => {
    const imageUrl = uploadsApi.getFileUrl(file.file_path);
    setUploadedImages((prev) => [...prev, file]);

    // Set as featured_image if first image
    if (!formData.featured_image) {
      setFormData((prev: ProjectCreate) => ({
        ...prev,
        featured_image: imageUrl,
        gallery: [imageUrl],
      }));
    } else {
      // Add to gallery
      setFormData((prev: ProjectCreate) => ({
        ...prev,
        gallery: [...(prev.gallery || []), imageUrl],
      }));
    }
    
    // Reset error after successful upload
    setError("");
  };

  const handleRemoveImage = (index: number) => {
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newUploadedImages);

    if (index === 0 && newUploadedImages.length > 0) {
      // If removing first image, set second as featured
      const newFeaturedUrl = uploadsApi.getFileUrl(
        newUploadedImages[0].file_path
      );
      setFormData((prev: ProjectCreate) => ({
        ...prev,
        featured_image: newFeaturedUrl,
        gallery: newUploadedImages.map((img) =>
          uploadsApi.getFileUrl(img.file_path)
        ),
      }));
    } else {
      // Just update gallery
      setFormData((prev: ProjectCreate) => ({
        ...prev,
        gallery: newUploadedImages.map((img) =>
          uploadsApi.getFileUrl(img.file_path)
        ),
        featured_image:
          newUploadedImages.length > 0
            ? uploadsApi.getFileUrl(newUploadedImages[0].file_path)
            : "",
      }));
    }
  };

  const handleVideoUploadSuccess = (file: UploadedFile) => {
    setUploadedVideo(file);
    const videoUrl = uploadsApi.getFileUrl(file.file_path);
    setFormData((prev: ProjectCreate) => ({ ...prev, video_url: videoUrl }));
  };

  const handleUploadError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await projectsApi.create(formData);
      router.push("/cms/projects");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al crear proyecto");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Nuevo Proyecto</h1>
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
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Client Name and Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="client_name"
                  className="block text-sm font-medium mb-2"
                >
                  Cliente
                </label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium mb-2"
                >
                  Ubicación
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label
                htmlFor="short_description"
                className="block text-sm font-medium mb-2"
              >
                Descripción Corta
              </label>
              <textarea
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                rows={2}
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
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Challenge, Solution, Results */}
            <div>
              <label
                htmlFor="challenge"
                className="block text-sm font-medium mb-2"
              >
                Desafío
              </label>
              <textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="solution"
                className="block text-sm font-medium mb-2"
              >
                Solución
              </label>
              <textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="results"
                className="block text-sm font-medium mb-2"
              >
                Resultados
              </label>
              <textarea
                id="results"
                name="results"
                value={formData.results}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Image Gallery Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Galería de Imágenes (ilimitadas)
              </label>
              <FileUploader
                folder="projects"
                onUploadSuccess={handleImageUploadSuccess}
                onUploadError={handleUploadError}
                acceptedTypes="image/*"
                maxSize={20}
              />
              
              {/* Image Grid Preview */}
              {uploadedImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✓ {uploadedImages.length} imagen(es) subida(s)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="relative group rounded-lg overflow-hidden border dark:border-gray-700"
                      >
                        <img
                          src={uploadsApi.getFileUrl(image.file_path)}
                          alt={image.original_filename}
                          className="w-full h-32 object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                          {image.original_filename}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Video (opcional)
              </label>
              <FileUploader
                folder="projects"
                onUploadSuccess={handleVideoUploadSuccess}
                onUploadError={handleUploadError}
                acceptedTypes="video/*"
                maxSize={100}
              />
              {uploadedVideo && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  ✓ Video subido: {uploadedVideo.original_filename}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                Etiquetas (separadas por comas)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags?.join(", ") || ""}
                onChange={handleChange}
                placeholder="excavación, movimiento de tierras, etc."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Duration and Completion Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium mb-2"
                >
                  Duración
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="ej: 3 meses"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label
                  htmlFor="completion_date"
                  className="block text-sm font-medium mb-2"
                >
                  Fecha de Finalización
                </label>
                <input
                  type="date"
                  id="completion_date"
                  name="completion_date"
                  value={formData.completion_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
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
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Publicado</span>
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
              {loading ? "Creando..." : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
