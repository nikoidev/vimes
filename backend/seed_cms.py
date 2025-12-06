"""
Script para poblar la base de datos con datos iniciales para Excavaciones Maella
"""
import sys
from pathlib import Path

# Añadir el directorio backend al path
sys.path.append(str(Path(__file__).parent))

from datetime import date, datetime
from app.core.database import SessionLocal
from app.models.service import Service
from app.models.project import Project
from app.models.testimonial import Testimonial
from app.models.site_config import SiteConfig
from app.models.cms_page import CMSPage
from app.models.hero_image import HeroImage


def seed_services(db):
    """Crear servicios de excavación"""
    services = [
        {
            "title": "Excavaciones y Movimientos de Tierra",
            "slug": "excavaciones-movimientos-tierra",
            "short_description": "Excavaciones profesionales para todo tipo de proyectos en fincas y terrenos",
            "description": """Realizamos excavaciones y movimientos de tierra con maquinaria de última generación. 
            Contamos con retroexcavadoras, minicargadoras y equipos especializados para trabajos en fincas rústicas, 
            parcelas urbanas y terrenos de difícil acceso en Maella y comarca.""",
            "icon": "excavator",
            "features": [
                "Excavación de zanjas para tuberías y cimientos",
                "Nivelación y preparación de terrenos",
                "Movimiento de tierras para construcción",
                "Limpieza y desbroce de parcelas",
                "Trabajos en espacios reducidos"
            ],
            "price_text": "Presupuesto personalizado",
            "is_active": True,
            "is_featured": True,
            "order": 1,
            "meta_title": "Excavaciones en Maella - Movimientos de Tierra Profesionales",
            "meta_description": "Servicio profesional de excavaciones y movimientos de tierra en Maella. Maquinaria moderna para todo tipo de proyectos."
        },
        {
            "title": "Instalación de Tuberías de Agua",
            "slug": "instalacion-tuberias-agua",
            "short_description": "Instalación profesional de sistemas de agua en fincas y propiedades rurales",
            "description": """Especialistas en instalación de tuberías de agua para riego y abastecimiento en fincas. 
            Trabajamos con tuberías de PVC, polietileno y otros materiales de alta calidad. Garantizamos instalaciones 
            duraderas y eficientes adaptadas a las necesidades de cada propiedad.""",
            "icon": "water-pipe",
            "features": [
                "Instalación de tuberías para riego",
                "Sistemas de abastecimiento de agua",
                "Reparación de fugas y averías",
                "Conexión a redes de distribución",
                "Asesoramiento técnico personalizado"
            ],
            "price_text": "Desde 35€/metro lineal",
            "is_active": True,
            "is_featured": True,
            "order": 2,
            "meta_title": "Instalación de Tuberías de Agua en Maella - Profesionales",
            "meta_description": "Instalamos tuberías de agua para fincas en Maella. Sistemas de riego y abastecimiento con garantía."
        },
        {
            "title": "Acondicionamiento de Caminos y Accesos",
            "slug": "acondicionamiento-caminos-accesos",
            "short_description": "Mejora y mantenimiento de caminos rurales y accesos a fincas",
            "description": """Servicios de acondicionamiento de caminos rurales, creación de nuevos accesos y mantenimiento 
            de vías en propiedades rurales. Utilizamos zahorras, gravas y materiales apropiados para garantizar 
            la durabilidad y funcionalidad de los accesos.""",
            "icon": "road",
            "features": [
                "Apertura de nuevos caminos",
                "Mantenimiento de caminos existentes",
                "Compactación y nivelación",
                "Drenajes y cunetas",
                "Accesos para maquinaria pesada"
            ],
            "price_text": "Consultar presupuesto",
            "is_active": True,
            "is_featured": False,
            "order": 3,
            "meta_title": "Acondicionamiento de Caminos en Maella - Accesos Rurales",
            "meta_description": "Creación y mantenimiento de caminos rurales en Maella. Mejoramos los accesos a tu finca."
        },
        {
            "title": "Balsas y Depósitos de Agua",
            "slug": "balsas-depositos-agua",
            "short_description": "Construcción de balsas y depósitos para almacenamiento de agua",
            "description": """Construcción de balsas de riego y depósitos de agua para aprovechamiento en agricultura. 
            Realizamos toda la excavación, impermeabilización y sistemas de llenado necesarios para garantizar 
            un almacenamiento eficiente del agua.""",
            "icon": "water-tank",
            "features": [
                "Excavación y nivelación",
                "Impermeabilización con geomembrana",
                "Sistemas de llenado y vaciado",
                "Cálculo de capacidad óptima",
                "Mantenimiento y reparaciones"
            ],
            "price_text": "Según capacidad",
            "is_active": True,
            "is_featured": False,
            "order": 4,
            "meta_title": "Construcción de Balsas de Agua en Maella - Depósitos",
            "meta_description": "Construimos balsas y depósitos de agua para riego en Maella. Soluciones de almacenamiento eficientes."
        }
    ]
    
    print("🔧 Creando servicios...")
    for service_data in services:
        service = Service(**service_data)
        db.add(service)
    
    db.commit()
    print(f"✅ {len(services)} servicios creados")


def seed_projects(db):
    """Crear proyectos de ejemplo"""
    # Obtener IDs de servicios
    excavaciones_id = db.query(Service).filter(Service.slug == "excavaciones-movimientos-tierra").first().id
    tuberias_id = db.query(Service).filter(Service.slug == "instalacion-tuberias-agua").first().id
    
    projects = [
        {
            "title": "Instalación de Sistema de Riego en Finca Olivar",
            "slug": "instalacion-riego-finca-olivar",
            "client_name": "Juan García",
            "location": "Maella, Zaragoza",
            "short_description": "Sistema completo de riego por goteo para 5 hectáreas de olivar",
            "description": "Proyecto integral de instalación de sistema de riego por goteo en finca de olivar de 5 hectáreas.",
            "challenge": "La finca presentaba un terreno irregular con desniveles significativos y estaba ubicada en una zona sin acceso directo a la red de agua.",
            "solution": "Se realizó la excavación de zanjas para tuberías principales, instalación de depósito de 50m³, y sistema de riego por goteo con programación automática.",
            "results": "El cliente ahora dispone de un sistema de riego eficiente que ha reducido el consumo de agua en un 40% y mejorado la productividad del olivar.",
            "service_id": tuberias_id,
            "tags": ["riego", "olivar", "agricultura"],
            "duration": "3 semanas",
            "completion_date": date(2024, 6, 15),
            "is_published": True,
            "is_featured": True,
            "order": 1,
            "meta_title": "Caso de Éxito: Sistema de Riego en Olivar - Maella",
            "meta_description": "Instalación completa de sistema de riego por goteo en finca de olivar en Maella."
        },
        {
            "title": "Excavación para Construcción de Nave Agrícola",
            "slug": "excavacion-nave-agricola",
            "client_name": "Cooperativa Agrícola San José",
            "location": "Maella, Zaragoza",
            "short_description": "Excavación y nivelación de terreno para nave agrícola de 800m²",
            "description": "Trabajos de excavación, movimiento de tierras y nivelación para la construcción de una nave agrícola.",
            "challenge": "Terreno con fuerte pendiente y presencia de roca que dificultaba los trabajos de excavación.",
            "solution": "Utilizamos maquinaria pesada especializada y técnicas de voladura controlada para la roca. Se realizó una nivelación precisa del terreno.",
            "results": "Terreno perfectamente preparado para la construcción, cumpliendo todos los requisitos técnicos y plazos establecidos.",
            "service_id": excavaciones_id,
            "tags": ["excavación", "construcción", "nave"],
            "duration": "2 semanas",
            "completion_date": date(2024, 9, 20),
            "is_published": True,
            "is_featured": True,
            "order": 2,
            "meta_title": "Excavación para Nave Agrícola en Maella",
            "meta_description": "Proyecto de excavación y nivelación de terreno para construcción de nave agrícola."
        },
        {
            "title": "Balsa de Riego para Viñedo",
            "slug": "balsa-riego-vinedo",
            "client_name": "Bodegas del Valle",
            "location": "Maella, Zaragoza",
            "short_description": "Construcción de balsa de 100m³ para riego de viñedo",
            "description": "Excavación y construcción de balsa impermeabilizada para almacenamiento de agua de riego.",
            "challenge": "Necesidad de maximizar la capacidad de almacenamiento en un espacio limitado con garantías de impermeabilización.",
            "solution": "Diseño optimizado de balsa de 100m³ con impermeabilización con geomembrana de alta densidad y sistema de drenaje perimetral.",
            "results": "Balsa operativa que permite riego autónomo durante los meses de verano, independizando al cliente de restricciones hídricas.",
            "service_id": tuberias_id,
            "tags": ["balsa", "viñedo", "riego"],
            "duration": "1 mes",
            "completion_date": date(2024, 5, 10),
            "is_published": True,
            "is_featured": False,
            "order": 3,
            "meta_title": "Construcción de Balsa de Riego para Viñedo - Maella",
            "meta_description": "Balsa de agua de 100m³ para riego de viñedo en Maella."
        }
    ]
    
    print("📁 Creando proyectos...")
    for project_data in projects:
        project = Project(**project_data)
        db.add(project)
    
    db.commit()
    print(f"✅ {len(projects)} proyectos creados")


def seed_testimonials(db):
    """Crear testimonios de clientes"""
    testimonials = [
        {
            "client_name": "María López",
            "client_position": "Propietaria",
            "client_company": "Finca Los Olivos",
            "client_location": "Maella, Zaragoza",
            "testimonial": "Excelente servicio. Instalaron el sistema de riego de mi olivar en tiempo récord y con un resultado impecable. Muy profesionales y con precios competitivos.",
            "rating": 5.0,
            "is_published": True,
            "is_featured": True,
            "order": 1
        },
        {
            "client_name": "Pedro Martínez",
            "client_position": "Agricultor",
            "client_location": "Maella, Zaragoza",
            "testimonial": "Necesitaba excavar para instalar tuberías de agua en mi finca y el resultado ha sido excepcional. Trabajaron con cuidado y dejaron todo perfectamente limpio.",
            "rating": 5.0,
            "is_published": True,
            "is_featured": True,
            "order": 2
        },
        {
            "client_name": "Antonio Sánchez",
            "client_position": "Gerente",
            "client_company": "Construcciones del Matarraña",
            "client_location": "Maella, Zaragoza",
            "testimonial": "Llevamos años colaborando con ellos en nuestros proyectos. Siempre cumplen plazos y la calidad de su trabajo es excepcional. Totalmente recomendables.",
            "rating": 5.0,
            "is_published": True,
            "is_featured": True,
            "order": 3
        },
        {
            "client_name": "Carmen Ruiz",
            "client_position": "Propietaria",
            "client_location": "Fabara, Zaragoza",
            "testimonial": "Construyeron una balsa de riego en mi finca y estoy encantada. El trabajo fue rápido y eficiente. Ahora tengo agua suficiente para toda la temporada.",
            "rating": 5.0,
            "is_published": True,
            "is_featured": False,
            "order": 4
        }
    ]
    
    print("💬 Creando testimonios...")
    for testimonial_data in testimonials:
        testimonial = Testimonial(**testimonial_data)
        db.add(testimonial)
    
    db.commit()
    print(f"✅ {len(testimonials)} testimonios creados")


def seed_site_config(db):
    """Crear configuración del sitio"""
    config_data = {
        "company_name": "Excavaciones y Tuberías Maella",
        "tagline": "Especialistas en excavaciones e instalación de tuberías en Maella y comarca",
        "description": "Empresa especializada en excavaciones, instalación de tuberías de agua, acondicionamiento de caminos y construcción de balsas de riego en Maella, Zaragoza. Con más de 15 años de experiencia en el sector.",
        "email": "info@excavacionesmaella.com",
        "phone": "+34 978 XXX XXX",
        "whatsapp": "+34 XXX XXX XXX",
        "address": "Calle Principal, 123",
        "city": "Maella",
        "province": "Zaragoza",
        "postal_code": "50560",
        "country": "España",
        "social_facebook": "https://facebook.com/excavacionesmaella",
        "social_instagram": "https://instagram.com/excavacionesmaella",
        "primary_color": "#f97316",
        "secondary_color": "#1e40af",
        "business_hours": {
            "lunes": "8:00 - 18:00",
            "martes": "8:00 - 18:00",
            "miercoles": "8:00 - 18:00",
            "jueves": "8:00 - 18:00",
            "viernes": "8:00 - 18:00",
            "sabado": "9:00 - 14:00",
            "domingo": "Cerrado"
        },
        "default_meta_title": "Excavaciones Maella - Servicios de Excavación e Instalación de Tuberías",
        "default_meta_description": "Empresa de excavaciones e instalación de tuberías en Maella, Zaragoza. Especialistas en movimientos de tierra, sistemas de riego y balsas de agua.",
        "default_meta_keywords": "excavaciones maella, tuberías agua maella, riego maella, balsas agua, movimientos tierra",
        "footer_text": "© 2024 Excavaciones Maella. Todos los derechos reservados. Empresa especializada en excavaciones e instalación de tuberías en Maella y comarca del Matarraña.",
        "maintenance_mode": False
    }
    
    print("⚙️ Creando configuración del sitio...")
    config = SiteConfig(**config_data)
    db.add(config)
    db.commit()
    print("✅ Configuración del sitio creada")


def seed_cms_pages(db):
    """Crear páginas CMS"""
    pages = [
        {
            "title": "Inicio",
            "slug": "inicio",
            "meta_title": "Excavaciones Maella - Servicios Profesionales en Zaragoza",
            "meta_description": "Excavaciones, instalación de tuberías y sistemas de riego en Maella. Más de 15 años de experiencia. Presupuestos sin compromiso.",
            "content": "Página de inicio con secciones hero, servicios destacados, proyectos y contacto",
            "is_published": True,
            "is_homepage": True,
            "template": "homepage",
            "order": 1
        },
        {
            "title": "Sobre Nosotros",
            "slug": "sobre-nosotros",
            "meta_title": "Sobre Nosotros - Excavaciones Maella",
            "meta_description": "Conoce nuestra empresa, equipo y trayectoria en el sector de excavaciones e instalación de tuberías en Maella.",
            "content": "Información sobre la empresa, equipo, valores y trayectoria",
            "is_published": True,
            "is_homepage": False,
            "template": "default",
            "order": 2
        },
        {
            "title": "Contacto",
            "slug": "contacto",
            "meta_title": "Contacto - Excavaciones Maella",
            "meta_description": "Contáctanos para solicitar presupuesto sin compromiso. Teléfono, email y formulario de contacto.",
            "content": "Página de contacto con formulario, mapa y datos de contacto",
            "is_published": True,
            "is_homepage": False,
            "template": "contact",
            "order": 3
        }
    ]
    
    print("📄 Creando páginas CMS...")
    for page_data in pages:
        page = CMSPage(**page_data)
        db.add(page)
    
    db.commit()
    print(f"✅ {len(pages)} páginas CMS creadas")


def seed_hero_images(db):
    """Crear imágenes para la galería del hero"""
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
    """Ejecutar todos los seeds"""
    print("\n🌱 Iniciando seed de base de datos para Excavaciones Maella...\n")
    
    db = SessionLocal()
    try:
        seed_services(db)
        seed_projects(db)
        seed_testimonials(db)
        seed_site_config(db)
        seed_cms_pages(db)
        seed_hero_images(db)
        
        print("\n✨ ¡Seed completado exitosamente!")
        print("🎉 La base de datos ha sido poblada con datos iniciales\n")
        
    except Exception as e:
        print(f"\n❌ Error durante el seed: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
