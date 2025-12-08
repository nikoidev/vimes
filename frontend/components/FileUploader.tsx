"use client";

import { useState } from "react";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ImageCropper from "./ImageCropper";

interface FileUploaderProps {
  folder: "hero" | "services" | "projects";
  onUploadSuccess?: (file: UploadedFile) => void;
  onUploadError?: (error: string) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  showCropper?: boolean; // Si es true, muestra el cropper antes de subir
  aspectRatio?: number; // Relación de aspecto para el cropper (ej: 16/9, 4/3, 3/2)
  targetWidth?: number; // Ancho objetivo en píxeles
  targetHeight?: number; // Alto objetivo en píxeles
  showPreview?: boolean; // Si es false, no muestra la vista previa de la imagen
}

interface UploadedFile {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  folder: string;
  uploaded_by: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export default function FileUploader({
  folder,
  onUploadSuccess,
  onUploadError,
  acceptedTypes = "image/*",
  maxSize = 20,
  disabled = false,
  showCropper = false,
  aspectRatio = 16 / 9,
  targetWidth = 1920,
  targetHeight = 1080,
  showPreview = true,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (acceptedTypes && !file.type.match(acceptedTypes.replace("*", ".*"))) {
      onUploadError?.(`Tipo de archivo no permitido: ${file.type}`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      onUploadError?.(
        `Archivo muy grande: ${fileSizeMB.toFixed(2)}MB (máx ${maxSize}MB)`
      );
      return;
    }

    setSelectedFile(file);

    // Generate preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        
        // Si showCropper está activado, mostrar el modal del cropper
        if (showCropper) {
          setShowCropperModal(true);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No autenticado");
      }

      const formData = new FormData();
      
      // Si hay una imagen recortada, usarla; si no, usar el archivo original
      if (croppedBlob) {
        // Convertir el blob recortado a File con el nombre original
        const croppedFile = new File([croppedBlob], selectedFile.name, {
          type: croppedBlob.type,
          lastModified: Date.now(),
        });
        formData.append("file", croppedFile);
      } else {
        formData.append("file", selectedFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/uploads/?folder=${folder}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al subir archivo");
      }

      const uploadedFile: UploadedFile = await response.json();
      onUploadSuccess?.(uploadedFile);

      // Reset state
      setSelectedFile(null);
      setPreview(null);
      setUploadProgress(0);
      setCroppedBlob(null);
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError?.(
        error instanceof Error ? error.message : "Error al subir archivo"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    setCroppedBlob(null);
    setShowCropperModal(false);
  };

  const handleCropComplete = (blob: Blob) => {
    setCroppedBlob(blob);
    setShowCropperModal(false);
    
    // Actualizar preview con la imagen recortada
    const url = URL.createObjectURL(blob);
    setPreview(url);
  };

  const handleCropCancel = () => {
    setShowCropperModal(false);
    // Volver a la selección de archivo
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      {!selectedFile && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={() => {
            if (!disabled) {
              document.getElementById("file-input")?.click();
            }
          }}
        >
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Arrastra y suelta un archivo aquí, o haz clic para seleccionar
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            {acceptedTypes === "image/*" ? "Imágenes" : acceptedTypes} hasta{" "}
            {maxSize}MB
          </p>
          <input
            id="file-input"
            type="file"
            accept={acceptedTypes}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
        </div>
      )}

      {/* Preview and Upload */}
      {selectedFile && (
        <div className="border rounded-lg p-4 space-y-4">
          {/* Preview */}
          {showPreview && preview && (
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* File Info */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="ml-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || disabled}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? "Subiendo..." : "Subir Archivo"}
          </button>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropperModal && preview && (
        <ImageCropper
          imageUrl={preview}
          aspectRatio={aspectRatio}
          targetWidth={targetWidth}
          targetHeight={targetHeight}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
