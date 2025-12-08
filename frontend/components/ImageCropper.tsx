'use client'

import { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropperProps {
  imageUrl: string
  aspectRatio: number
  targetWidth?: number
  targetHeight?: number
  onCropComplete: (croppedImageBlob: Blob) => void
  onCancel: () => void
}

export default function ImageCropper({ 
  imageUrl, 
  aspectRatio, 
  targetWidth = 1920, 
  targetHeight = 1080, 
  onCropComplete, 
  onCancel 
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const [processing, setProcessing] = useState(false)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    
    // Calcular crop inicial centrado
    const cropWidth = width
    const cropHeight = width / aspectRatio
    
    const crop: Crop = {
      unit: '%',
      x: 0,
      y: ((height - cropHeight) / 2 / height) * 100,
      width: 100,
      height: (cropHeight / height) * 100
    }
    
    setCrop(crop)
  }, [aspectRatio])

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return

    setProcessing(true)

    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      setProcessing(false)
      return
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Set canvas size to target dimensions passed as props
    canvas.width = targetWidth
    canvas.height = targetHeight

    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    )

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob)
        }
        setProcessing(false)
      },
      'image/jpeg',
      0.95
    )
  }, [completedCrop, targetWidth, targetHeight, onCropComplete])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ajustar Imagen
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Arrastra para seleccionar el área que deseas mostrar
          </p>
        </div>

        <div className="p-6">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Crop"
                onLoad={onImageLoad}
                className="max-w-full h-auto"
              />
            </ReactCrop>
          </div>

          {completedCrop && (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Vista Previa (cómo se verá en la web)
              </h3>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: `${aspectRatio}` }}>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${-completedCrop.x}px ${-completedCrop.y}px`,
                    width: `${(imgRef.current?.width || 0) * 100 / completedCrop.width}%`,
                    height: `${(imgRef.current?.height || 0) * 100 / completedCrop.height}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-1">Consejos para mejores resultados:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Usa imágenes de alta calidad</li>
                  <li>Asegúrate de que los elementos importantes estén dentro del área seleccionada</li>
                  <li>La imagen se redimensionará automáticamente al tamaño óptimo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={processing}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={getCroppedImg}
            disabled={!completedCrop || processing}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Procesando...' : 'Aplicar y Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
