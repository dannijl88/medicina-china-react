# Medicina China Codex

Web corporativa estática para terapias, talleres, formaciones y productos artesanales.

## Estado actual del proyecto

El proyecto ha quedado convertido a una web solo frontend.

- Sin backend
- Sin base de datos
- Sin login ni panel de administración
- Sin sistema de citas online
- Sin sistema de reseñas dinámicas
- Sin compra online integrada

La web funciona como escaparate corporativo e informativo, con contacto por email, teléfono y WhatsApp.

## Stack

- React
- Vite
- React Router con `HashRouter`

## Estructura

- `frontend`: aplicación completa lista para desarrollo, build y despliegue en hosting estático

## Desarrollo

```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

## Build para producción

```bash
cd frontend
npm.cmd run build
```

El resultado final se genera en:

```text
frontend/dist
```

## Despliegue

La aplicación usa `HashRouter`, así que no necesita configuración especial de `htaccess` para que funcionen las rutas internas en un hosting estático.

Solo hay que subir el contenido de:

```text
frontend/dist
```

## Páginas incluidas

- Inicio
- Terapias
- Talleres
- Formaciones
- Productos
- Contacto
- Aviso legal
- Privacidad
- Cookies

## Notas

- La página de `Condiciones` sigue existiendo en el código, pero está oculta del footer por si en el futuro se reactiva una parte de compra o contratación online.
- El formulario de contacto actual prepara un email desde el navegador del usuario; no hay envío automático por servidor.
