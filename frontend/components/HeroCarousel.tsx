'use client'

import { useEffect, useState } from 'react'
import { heroImagesApi } from '@/lib/api/hero-images'
import type { HeroImage } from '@/types'

interface HeroCarouselProps {
  companyName?: string
  tagline?: string
  description?: string
}

export default function HeroCarousel({ companyName, tagline, description }: HeroCarouselProps) {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    fetchHeroImages()
  }, [])

  useEffect(() => {
    if (heroImages.length <= 1) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // Cambiar cada 5 segundos

    return () => clearInterval(interval)
  }, [currentIndex, heroImages.length])

  const fetchHeroImages = async () => {
    try {
      const images = await heroImagesApi.getAll({ active_only: true })
      if (images.length > 0) {
        setHeroImages(images)
      }
    } catch (err) {
      console.error('Error cargando imágenes hero:', err)
    }
  }

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const currentImage = heroImages[currentIndex]

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-orange-500 to-blue-700 text-white overflow-hidden">
      {/* Background Image */}
      {heroImages.length > 0 && currentImage?.image_url && (
        <div className="absolute inset-0">
          <img
            src={currentImage.image_url}
            alt={currentImage.title || 'Hero Image'}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {currentImage?.title || companyName || 'Excavaciones Maella'}
          </h1>
          <p className="text-2xl md:text-3xl mb-6 drop-shadow-md">
            {currentImage?.subtitle || tagline || 'Especialistas en excavaciones e instalación de tuberías'}
          </p>
          {(currentImage?.description || description) && (
            <p className="text-lg md:text-xl mb-8 opacity-90 drop-shadow-md max-w-2xl">
              {currentImage?.description || description}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <a
              href={currentImage?.button_url || '#servicios'}
              className="px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              {currentImage?.button_text || 'Nuestros Servicios'}
            </a>
            <a
              href="#contacto"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition"
            >
              Contactar
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
