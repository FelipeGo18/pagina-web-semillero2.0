# Web Semillero (React + Node/Express)

Este monorepo contiene:
- `frontend/`: React con Vite (sin Tailwind)
- `backend/`: API REST con Node/Express

## Requisitos
- Node.js 18+
- npm 8+

## Desarrollo

1) Backend (puerto 4000 por defecto)
- Copia `.env.example` a `.env` (opcional):
```
PORT=4000
CORS_ORIGIN=http://localhost:5173
```
- Ejecuta en `backend/`:
```
npm run dev
```

2) Frontend (Vite en puerto 5173)
- Actualmente el frontend está independiente (sin conexión a la API).
- Ejecuta en `frontend/`:
```
npm run dev
```
No hay proxy a `/api` configurado por ahora.

## Producción con Apache en Raspberry Pi

1) Build del frontend:
```
cd frontend
npm run build
```
Esto genera `frontend/dist/` con los estáticos.

2) Despliegue estáticos:
- Copia `dist/` a la carpeta del VirtualHost, por ejemplo `/var/www/semillero`.

3) Backend como servicio:
- Ejecuta el backend en `localhost:4000` (pm2 o systemd recomendado).

4) Apache como reverse proxy para la API:
```
<VirtualHost *:80>
    ServerName semillero.local

    DocumentRoot /var/www/semillero
    <Directory /var/www/semillero>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass /api http://127.0.0.1:4000/api
    ProxyPassReverse /api http://127.0.0.1:4000/api

    ErrorLog ${APACHE_LOG_DIR}/semillero-error.log
    CustomLog ${APACHE_LOG_DIR}/semillero-access.log combined
</VirtualHost>
```

Habilita módulos de Apache:
```
sudo a2enmod proxy proxy_http headers rewrite
sudo systemctl reload apache2
```

## Endpoints
- `GET /api/health` → estado del backend.

## Notas
- No se usa Tailwind.
- Ajusta CORS a tus dominios reales en producción.
