# Script para configurar el firewall de Windows
# EJECUTAR COMO ADMINISTRADOR

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuración de Firewall" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si se ejecuta como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: Este script debe ejecutarse como Administrador" -ForegroundColor Red
    Write-Host ""
    Write-Host "Click derecho en PowerShell y selecciona 'Ejecutar como Administrador'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Ejecutando con permisos de Administrador" -ForegroundColor Green
Write-Host ""

# Eliminar reglas existentes si las hay
Write-Host "🔧 Eliminando reglas antiguas si existen..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="Backend FastAPI" >$null 2>&1
netsh advfirewall firewall delete rule name="Frontend Next.js" >$null 2>&1

# Crear regla para el Backend (Puerto 8000)
Write-Host "🔓 Creando regla para Backend (Puerto 8000)..." -ForegroundColor Cyan
netsh advfirewall firewall add rule name="Backend FastAPI" dir=in action=allow protocol=TCP localport=8000

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Regla para puerto 8000 creada exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al crear regla para puerto 8000" -ForegroundColor Red
}

# Crear regla para el Frontend (Puerto 3000)
Write-Host "🔓 Creando regla para Frontend (Puerto 3000)..." -ForegroundColor Cyan
netsh advfirewall firewall add rule name="Frontend Next.js" dir=in action=allow protocol=TCP localport=3000

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Regla para puerto 3000 creada exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al crear regla para puerto 3000" -ForegroundColor Red
}

# Mostrar IP local
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuración Completada" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*" } | Select-Object -First 1).IPAddress

Write-Host "📍 Tu IP Local: $ipAddress" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 URLs de acceso desde otra PC:" -ForegroundColor Green
Write-Host "   Frontend: http://${ipAddress}:3000" -ForegroundColor White
Write-Host "   Backend:  http://${ipAddress}:8000" -ForegroundColor White
Write-Host "   Docs API: http://${ipAddress}:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "✨ Ahora puedes acceder desde cualquier dispositivo en tu red WiFi" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Recuerda: Ambos dispositivos deben estar en la misma red WiFi" -ForegroundColor Yellow
Write-Host ""

pause
