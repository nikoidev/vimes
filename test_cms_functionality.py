"""
Script de Pruebas Automatizadas del CMS
Verifica todas las funcionalidades principales del sistema
"""

import requests
import json
from datetime import datetime
from typing import Dict, List

# Configuración
BASE_URL = "http://localhost:8000/api"
TEST_USER = {
    "email": "admin@example.com",
    "password": "admin123"
}

class CMSTester:
    def __init__(self):
        self.token = None
        self.headers = {}
        self.results = {
            "passed": [],
            "failed": [],
            "warnings": []
        }
    
    def log(self, test_name: str, status: str, message: str = ""):
        """Registrar resultado de prueba"""
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        if status == "PASS":
            self.results["passed"].append(result)
            print(f"✅ {test_name}: {message if message else 'OK'}")
        elif status == "FAIL":
            self.results["failed"].append(result)
            print(f"❌ {test_name}: {message}")
        else:  # WARNING
            self.results["warnings"].append(result)
            print(f"⚠️  {test_name}: {message}")
    
    def login(self):
        """Autenticación"""
        try:
            # El endpoint espera form-data con username en lugar de email
            form_data = {
                "username": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
            response = requests.post(
                f"{BASE_URL}/auth/login",
                data=form_data
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data["access_token"]
                self.headers = {"Authorization": f"Bearer {self.token}"}
                self.log("Autenticación", "PASS", "Login exitoso")
                return True
            else:
                self.log("Autenticación", "FAIL", f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log("Autenticación", "FAIL", str(e))
            return False
    
    def test_services_crud(self):
        """Pruebas de Servicios"""
        print("\n📦 Probando SERVICIOS...")
        
        # GET all services
        try:
            response = requests.get(f"{BASE_URL}/services/")
            if response.status_code == 200:
                services = response.json()
                self.log("Servicios - Listar", "PASS", f"{len(services)} servicios encontrados")
            else:
                self.log("Servicios - Listar", "FAIL", f"Status {response.status_code}")
        except Exception as e:
            self.log("Servicios - Listar", "FAIL", str(e))
        
        # GET service by ID (if exists)
        if len(services) > 0:
            try:
                service_id = services[0]["id"]
                response = requests.get(f"{BASE_URL}/services/{service_id}")
                if response.status_code == 200:
                    self.log("Servicios - Obtener por ID", "PASS")
                else:
                    self.log("Servicios - Obtener por ID", "FAIL", f"Status {response.status_code}")
            except Exception as e:
                self.log("Servicios - Obtener por ID", "FAIL", str(e))
            
            # GET service by slug
            try:
                slug = services[0]["slug"]
                response = requests.get(f"{BASE_URL}/services/slug/{slug}")
                if response.status_code == 200:
                    self.log("Servicios - Obtener por Slug", "PASS")
                else:
                    self.log("Servicios - Obtener por Slug", "FAIL", f"Status {response.status_code}")
            except Exception as e:
                self.log("Servicios - Obtener por Slug", "FAIL", str(e))
        else:
            self.log("Servicios - Operaciones", "WARNING", "No hay servicios para probar")
    
    def test_projects_crud(self):
        """Pruebas de Proyectos"""
        print("\n🏗️  Probando PROYECTOS...")
        
        try:
            response = requests.get(f"{BASE_URL}/projects/")
            if response.status_code == 200:
                projects = response.json()
                self.log("Proyectos - Listar", "PASS", f"{len(projects)} proyectos encontrados")
                
                if len(projects) > 0:
                    project_id = projects[0]["id"]
                    response = requests.get(f"{BASE_URL}/projects/{project_id}")
                    if response.status_code == 200:
                        self.log("Proyectos - Obtener por ID", "PASS")
            else:
                self.log("Proyectos - Listar", "FAIL", f"Status {response.status_code}")
        except Exception as e:
            self.log("Proyectos - Operaciones", "FAIL", str(e))
    
    def test_hero_images(self):
        """Pruebas de Hero Images"""
        print("\n🖼️  Probando HERO IMAGES...")
        
        try:
            response = requests.get(f"{BASE_URL}/hero-images/")
            if response.status_code == 200:
                images = response.json()
                self.log("Hero Images - Listar", "PASS", f"{len(images)} imágenes encontradas")
            else:
                self.log("Hero Images - Listar", "FAIL", f"Status {response.status_code}")
        except Exception as e:
            self.log("Hero Images - Operaciones", "FAIL", str(e))
    
    def test_testimonials(self):
        """Pruebas de Testimonios"""
        print("\n💬 Probando TESTIMONIOS...")
        
        try:
            response = requests.get(f"{BASE_URL}/testimonials/")
            if response.status_code == 200:
                testimonials = response.json()
                self.log("Testimonios - Listar", "PASS", f"{len(testimonials)} testimonios encontrados")
            else:
                self.log("Testimonios - Listar", "FAIL", f"Status {response.status_code}")
        except Exception as e:
            self.log("Testimonios - Operaciones", "FAIL", str(e))
    
    def test_cms_pages(self):
        """Pruebas de Páginas CMS"""
        print("\n📄 Probando PÁGINAS CMS...")
        
        try:
            response = requests.get(f"{BASE_URL}/cms/pages/")
            if response.status_code == 200:
                pages = response.json()
                self.log("CMS Pages - Listar", "PASS", f"{len(pages)} páginas encontradas")
            else:
                self.log("CMS Pages - Listar", "FAIL", f"Status {response.status_code}")
        except Exception as e:
            self.log("CMS Pages - Operaciones", "FAIL", str(e))
    
    def test_contact_leads(self):
        """Pruebas de Contactos"""
        print("\n📧 Probando CONTACTOS...")
        
        try:
            # POST: Create contact lead (público, no requiere auth)
            contact_data = {
                "name": "Test Usuario",
                "email": "test@example.com",
                "phone": "123456789",
                "message": "Mensaje de prueba automática"
            }
            response = requests.post(f"{BASE_URL}/contact/", json=contact_data)
            if response.status_code == 201:
                self.log("Contactos - Crear", "PASS")
            else:
                self.log("Contactos - Crear", "FAIL", f"Status {response.status_code}")
            
            # GET: List contacts (requiere auth)
            response = requests.get(f"{BASE_URL}/contact/", headers=self.headers)
            if response.status_code == 200:
                contacts = response.json()
                self.log("Contactos - Listar", "PASS", f"{contacts['total']} contactos")
            else:
                self.log("Contactos - Listar", "FAIL", f"Status {response.status_code}")
        except Exception as e:
            self.log("Contactos - Operaciones", "FAIL", str(e))
    
    def test_site_config(self):
        """Pruebas de Configuración del Sitio"""
        print("\n⚙️  Probando CONFIGURACIÓN...")
        
        try:
            response = requests.get(f"{BASE_URL}/site-config/")
            if response.status_code == 200:
                config = response.json()
                self.log("Configuración - Obtener", "PASS")
            else:
                self.log("Configuración - Obtener", "FAIL", f"Status {response.status_code}")
        except Exception as e:
            self.log("Configuración - Operaciones", "FAIL", str(e))
    
    def test_uploads(self):
        """Pruebas de Sistema de Archivos"""
        print("\n📤 Probando UPLOADS...")
        
        try:
            # GET uploads by folder
            response = requests.get(f"{BASE_URL}/uploads/services", headers=self.headers)
            if response.status_code == 200:
                uploads = response.json()
                self.log("Uploads - Listar por carpeta", "PASS", f"{uploads['total']} archivos en services/")
            else:
                self.log("Uploads - Listar por carpeta", "FAIL", f"Status {response.status_code}")
        except Exception as e:
            self.log("Uploads - Operaciones", "FAIL", str(e))
    
    def generate_report(self):
        """Generar reporte de resultados"""
        print("\n" + "="*60)
        print("📊 REPORTE DE PRUEBAS - CMS EXCAVACIONES MAELLA")
        print("="*60)
        
        total = len(self.results["passed"]) + len(self.results["failed"]) + len(self.results["warnings"])
        passed = len(self.results["passed"])
        failed = len(self.results["failed"])
        warnings = len(self.results["warnings"])
        
        print(f"\n✅ Pruebas exitosas: {passed}/{total}")
        print(f"❌ Pruebas fallidas: {failed}/{total}")
        print(f"⚠️  Advertencias: {warnings}/{total}")
        
        if failed > 0:
            print("\n❌ PRUEBAS FALLIDAS:")
            for result in self.results["failed"]:
                print(f"  - {result['test']}: {result['message']}")
        
        if warnings > 0:
            print("\n⚠️  ADVERTENCIAS:")
            for result in self.results["warnings"]:
                print(f"  - {result['test']}: {result['message']}")
        
        # Calcular porcentaje de éxito
        success_rate = (passed / total * 100) if total > 0 else 0
        print(f"\n📈 Tasa de éxito: {success_rate:.1f}%")
        
        # Guardar reporte JSON
        with open("cms_test_report.json", "w", encoding="utf-8") as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        print("\n💾 Reporte guardado en: cms_test_report.json")
        
        return success_rate >= 80  # 80% o más para considerar exitoso
    
    def run_all_tests(self):
        """Ejecutar todas las pruebas"""
        print("🚀 Iniciando pruebas del CMS...\n")
        
        # Autenticación
        if not self.login():
            print("❌ No se pudo autenticar. Abortando pruebas.")
            return False
        
        # Ejecutar pruebas
        self.test_services_crud()
        self.test_projects_crud()
        self.test_hero_images()
        self.test_testimonials()
        self.test_cms_pages()
        self.test_contact_leads()
        self.test_site_config()
        self.test_uploads()
        
        # Generar reporte
        return self.generate_report()

if __name__ == "__main__":
    tester = CMSTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)
