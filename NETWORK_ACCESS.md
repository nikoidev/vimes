# 🌐 Acceso desde Otra PC en la Red Local

## 📋 Pasos para Acceder

### 1. Obtener tu IP Local

En la PC donde está corriendo el servidor, ejecuta en CMD:
```cmd
ipconfig
```

Busca la línea que dice `IPv4 Address` (Dirección IPv4), por ejemplo:
```
IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

### 2. Configurar el Backend

El backend ya está configurado para aceptar conexiones desde cualquier IP (`0.0.0.0`).

### 3. Configurar el Frontend

En la PC **donde otra persona quiere acceder**:

1. Abre el navegador web
2. Ingresa la URL: `http://TU_IP_LOCAL:3000`
   - Ejemplo: `http://192.168.1.100:3000`

### 4. Configurar la URL del Backend (Si accedes desde otra PC al frontend)

Si estás desarrollando desde otra PC, necesitas decirle al frontend dónde está el backend:

1. En la PC donde corre el frontend, edita el archivo:
   ```
   frontend/.env.local
   ```

2. Cambia la línea a tu IP local:
   ```
   NEXT_PUBLIC_API_URL=http://192.168.1.100:8000
   ```

3. Reinicia el servidor Next.js (Ctrl+C y luego `npm run dev`)

## 🔥 Configuración del Firewall

### Windows Firewall

Si no puedes conectarte, necesitas permitir las conexiones:

1. Abre **Windows Defender Firewall**
2. Click en **Configuración avanzada**
3. Click en **Reglas de entrada** → **Nueva regla**
4. Selecciona **Puerto** → Siguiente
5. Selecciona **TCP** y agrega los puertos: `3000, 8000`
6. Selecciona **Permitir la conexión**
7. Aplica a Dominio, Privado y Público
8. Dale un nombre: "Excavaciones Maella - Dev Servers"

### Comando Rápido (PowerShell como Administrador)

```powershell
# Permitir puerto 8000 (Backend)
New-NetFirewallRule -DisplayName "Backend FastAPI" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow

# Permitir puerto 3000 (Frontend)
New-NetFirewallRule -DisplayName "Frontend Next.js" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

## 🎯 URLs de Acceso

Reemplaza `192.168.1.100` con tu IP local:

- **Frontend (Web):** `http://192.168.1.100:3000`
- **Backend (API):** `http://192.168.1.100:8000`
- **Documentación API:** `http://192.168.1.100:8000/docs`

## ⚠️ Solución de Problemas

### El navegador no carga la página

1. Verifica que ambos servidores estén corriendo
2. Verifica que estén en la misma red WiFi
3. Prueba hacer ping desde CMD:
   ```cmd
   ping 192.168.1.100
   ```
4. Desactiva temporalmente el firewall para probar

### Las imágenes no cargan

Las imágenes del hero usan URLs de Unsplash. Asegúrate de tener conexión a internet.

### Error de CORS

El backend ya está configurado con `allow_origins=["*"]` para desarrollo.

## 🔒 Importante para Producción

⚠️ **NO USES `allow_origins=["*"]` EN PRODUCCIÓN**

Para producción, especifica los dominios permitidos:
```python
allow_origins=["https://tudominio.com", "https://www.tudominio.com"]
```
