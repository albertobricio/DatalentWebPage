# Guía de Seguridad para Datalent Solutions Web

## Prácticas recomendadas
- Forzar HTTPS y HSTS en el servidor web
- Servir con headers HTTP seguros:
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
- Validar y sanear todos los datos de entrada en formularios
- Mantener dependencias actualizadas
- Revisar logs de errores y accesos

## Angular
- Usar binding seguro ([property], {{expression}}) para evitar XSS
- No exponer claves ni secretos en el frontend

## Email
- Validación estricta de emails y mensajes
- Limitar tamaño de mensajes

## Cumplimiento legal
- Incluir enlaces a políticas de privacidad y cookies
- Gestionar consentimiento de cookies

---

Para dudas o incidencias de seguridad: gmorales@datalentsolutions.com
