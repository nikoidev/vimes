"""
Script to run the FastAPI application.
Usage: python run.py
"""
import uvicorn
import socket

if __name__ == "__main__":
    # Obtener la IP local
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    
    print(f"\n🚀 Servidor iniciando...")
    print(f"📍 IP Local: {local_ip}")
    print(f"🌐 Accede desde otra PC: http://{local_ip}:8000")
    print(f"📚 Documentación: http://{local_ip}:8000/docs\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
