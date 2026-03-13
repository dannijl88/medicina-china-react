# Medicina China Codex

Aplicacion full-stack para una web corporativa de terapias, talleres y productos artesanales.

## Stack

- Frontend: React + Vite
- Backend: Spring Boot + Spring Security + JWT + JPA + MySQL + Maven

## Estructura

- `frontend`: web corporativa multipagina con home, terapias, talleres, productos, contacto y login
- `backend`: API REST con contenido publico, autenticacion y gestion de citas

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

### Frontend

```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

## Credenciales demo

- `cliente@medicinachina.com` / `Bienestar2026!`
- `admin@medicinachina.com` / `Relax2026!`

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
