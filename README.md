# Medicina China Codex

Aplicacion full-stack para una web corporativa de terapias, talleres, formaciones descargables y productos artesanales.

## Stack

- Frontend: React + Vite
- Backend: Spring Boot + Spring Security + JWT + JPA + MySQL + Maven

## Estructura

- `frontend`: web corporativa multipagina con home, terapias, talleres, formaciones, productos, contacto, login y citas
- `backend`: API REST con contenido publico, autenticacion, gestion de citas, compras/descargas de formaciones y panel admin
- `reviews`: sistema propio de reseñas con moderacion para terapias, talleres, productos y formaciones

## Arranque

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Base de datos MySQL

```bash
mysql-workbench -> ejecutar database/mysql-workbench.sql
```

### Variables utiles para backend

```bash
DB_USERNAME=root
DB_PASSWORD=sasa
FRONTEND_BASE_URL=http://localhost:5173
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Si `STRIPE_SECRET_KEY` esta vacia, la compra de formaciones funciona en modo simulado para poder probar el flujo completo sin cobro real.

### Frontend

```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

## Credenciales demo

- `cliente@medicinachina.com` / `Bienestar2026!`
- `admin@medicinachina.com` / `Relax2026!`

## Panel admin

- Ruta frontend: `/admin`
- Visible solo para `ROLE_ADMIN`
- Permite gestionar:
  - terapias
  - talleres
  - productos
  - formaciones
  - citas
  - reseñas
  - usuarios

## Endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/public/home`
- `GET /api/user/me`
- `POST /api/appointments`
- `GET /api/appointments/me`
- `PUT /api/appointments/{id}`
- `DELETE /api/appointments/{id}`
- `GET /api/appointments`
- `PUT /api/appointments/{id}/status`
- `GET /api/trainings`
- `GET /api/trainings/{slug}`
- `GET /api/catalog?type=THERAPY`
- `POST /api/trainings/{id}/checkout`
- `GET /api/trainings/purchases/me`
- `POST /api/trainings/purchases/{id}/simulate-success`
- `GET /api/trainings/{id}/download`
- `POST /api/stripe/webhook`
- `GET /api/reviews?type=THERAPY&itemKey=acupuntura`
- `POST /api/reviews`
- `GET /api/reviews/pending`
- `PUT /api/reviews/{id}/status`
- `GET /api/catalog/admin?type=THERAPY`
- `POST /api/catalog/admin`
- `PUT /api/catalog/admin/{id}`
- `DELETE /api/catalog/admin/{id}`
- `GET /api/admin/trainings`
- `POST /api/admin/trainings`
- `PUT /api/admin/trainings/{id}`
- `DELETE /api/admin/trainings/{id}`
- `GET /api/admin/users`
- `DELETE /api/admin/users/{id}`
- `DELETE /api/appointments/admin/{id}`

## Stripe

- Stripe no tiene coste fijo por usar Checkout en modo test.
- En modo test puedes integrar y probar gratis.
- El cobro real empieza cuando pongas tus claves reales y uses modo live.
- Mientras no pongas claves reales, la app usa una pantalla de pago simulado para validar compra y descarga.

## Reseñas

- Las reseñas son internas, no dependen de Google.
- Un usuario logueado puede dejar una reseña por elemento.
- Las reseñas nuevas quedan en `PENDING`.
- El admin puede aprobar o rechazar desde `Login > Mi espacio`.
- Solo las reseñas `APPROVED` se muestran en la web.
