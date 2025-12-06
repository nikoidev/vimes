@echo off
echo ========================================
echo   Excavaciones Maella - Inicio Completo
echo ========================================
echo.

REM Obtener la IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do set IP=%%a
set IP=%IP:~1%

echo [1/3] Verificando contenedores Docker...
docker-compose up -d
if errorlevel 1 (
    echo Error: No se pudo iniciar Docker. Asegurate de que Docker Desktop este corriendo.
    pause
    exit /b 1
)
echo Contenedores iniciados correctamente!
echo.

echo Esperando a que PostgreSQL este listo...
timeout /t 3 /nobreak > nul
echo.

echo [2/3] Iniciando Backend (FastAPI)...
echo.
start "Backend - FastAPI" cmd /k "cd backend && ..\.venv\Scripts\python.exe run.py"
timeout /t 3 /nobreak >nul

echo [3/3] Iniciando Frontend (Next.js)...
echo.
start "Frontend - Next.js" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servidores Iniciados!
echo ========================================
echo.
echo Backend (API):  http://%IP%:8000
echo Frontend (Web): http://%IP%:3000
echo.
echo Documentacion:  http://%IP%:8000/docs
echo.
echo IMPORTANTE: Para acceder desde otra PC:
echo 1. Usa esta URL: http://%IP%:3000
echo 2. Asegurate de que el firewall permita conexiones
echo ========================================
echo.
echo   cd frontend
echo   npm install
echo   npm run dev
echo.

echo ========================================
echo  Accesos:
echo  - Frontend: http://localhost:3000
echo  - Backend API: http://localhost:8000/docs
echo  - pgAdmin: http://localhost:5051
echo ========================================
echo.
echo Credenciales por defecto:
echo   Username: admin
echo   Password: admin123
echo.

pause
