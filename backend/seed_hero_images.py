"""
Script para agregar solo las imágenes del hero
"""
import sys
from pathlib import Path

# Añadir el directorio backend al path
sys.path.append(str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.hero_image import HeroImage


def seed_hero_images(db):
    """Crear imágenes para la galería del hero"""
    # Limpiar imágenes existentes
    db.query(HeroImage).delete()
    
    images = [
        {
            "title": "Excavaciones Profesionales",
            "description": "Maquinaria de última generación para trabajos de excavación en Maella",
            "image_url": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop",
            "alt_text": "Retroexcavadora trabajando en proyecto de excavación",
            "is_active": True,
            "order": 1
        },
        {
            "title": "Instalación de Tuberías",
            "description": "Sistemas de riego y abastecimiento de agua para fincas",
            "image_url": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&h=1080&fit=crop",
            "alt_text": "Instalación profesional de tuberías de agua",
            "is_active": True,
            "order": 2
        },
        {
            "title": "Acondicionamiento de Terrenos",
            "description": "Nivelación y preparación de terrenos para construcción",
            "image_url": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&h=1080&fit=crop",
            "alt_text": "Trabajo de nivelación de terreno con maquinaria pesada",
            "is_active": True,
            "order": 3
        },
        {
            "title": "Proyectos Agrícolas",
            "description": "Soluciones integrales para el sector agrícola en Maella",
            "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop",
            "alt_text": "Vista aérea de proyecto agrícola completado",
            "is_active": True,
            "order": 4
        },
        {
            "title": "Balsas de Riego",
            "description": "Construcción de balsas para almacenamiento de agua",
            "image_url": "https://images.unsplash.com/photo-1494783404829-63a0be0eeaac?w=1920&h=1080&fit=crop",
            "alt_text": "Balsa de agua para riego agrícola",
            "is_active": True,
            "order": 5
        }
    ]
    
    print("🖼️  Creando imágenes del hero...")
    for image_data in images:
        image = HeroImage(**image_data)
        db.add(image)
    
    db.commit()
    print(f"✅ {len(images)} imágenes del hero creadas")


def main():
    """Ejecutar seed de imágenes del hero"""
    print("\n🌱 Agregando imágenes del hero...\n")
    
    db = SessionLocal()
    try:
        seed_hero_images(db)
        print("\n✨ ¡Imágenes del hero creadas exitosamente!\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
