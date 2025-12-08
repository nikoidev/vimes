'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
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
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [processing, setProcessing] = useState(false)

  // Update preview canvas when crop changes
  useEffect(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return

    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const image = imgRef.current
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Set canvas dimensions to fill container
    const container = canvas.parentElement
    if (!container) return
    
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    // Get crop coordinates in natural image dimensions
    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY
    const cropWidth = completedCrop.width * scaleX
    const cropHeight = completedCrop.height * scaleY

    // Fill with background color first
    ctx.fillStyle = '#1f2937' // gray-800
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Calculate how the cropped area will display with object-contain object-center
    // This mimics: className="w-full h-full object-contain object-center"
    const canvasAspect = canvas.width / canvas.height
    const cropAspect = cropWidth / cropHeight

    let drawWidth, drawHeight, offsetX, offsetY

    if (canvasAspect > cropAspect) {
      // Canvas is wider than crop - fit height, center horizontally
      drawHeight = canvas.height
      drawWidth = canvas.height * cropAspect
      offsetX = (canvas.width - drawWidth) / 2
      offsetY = 0
    } else {
      // Canvas is taller than crop - fit width, center vertically
      drawWidth = canvas.width
      drawHeight = canvas.width / cropAspect
      offsetX = 0
      offsetY = (canvas.height - drawHeight) / 2
    }

    ctx.drawImage(
      image,
      cropX, cropY, cropWidth, cropHeight,
      offsetX, offsetY, drawWidth, drawHeight
    )
  }, [completedCrop])

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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Ajustar Imagen
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Arrastra para seleccionar el área que deseas mostrar - Vista previa en tiempo real
          </p>
        </div>

        <div className="p-4 flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Panel izquierdo: Editor de recorte */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Selecciona el área a mostrar
              </h3>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 flex-1 flex items-center justify-center overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                >
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Crop"
                    onLoad={onImageLoad}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                </ReactCrop>
              </div>
            </div>

            {/* Panel derecho: Vista previa */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Vista previa (cómo se verá en la web)
              </h3>
              <div className="bg-gray-900 rounded-lg flex-1 flex items-center justify-center overflow-hidden relative">
                {completedCrop ? (
                  <div className="relative w-full h-full">
                    {/* Canvas para renderizar exactamente como en la web */}
                    <canvas
                      ref={previewCanvasRef}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient igual al de la web */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-gray-900/30 pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm text-center">
                    Selecciona un área para ver la vista previa
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between items-center gap-3">
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            La imagen se redimensionará a {targetWidth}x{targetHeight}px
          </div>
          <div className="flex gap-3">
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
    </div>
  )
}
