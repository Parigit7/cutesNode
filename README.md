# Cutes.lk Management App

A modern React + Spring Boot starter app for Cutes.lk using a black, white, and #d59ca3 theme.

## Backend

1. Install MySQL and create database `cuteslkdb`
2. Update `backend/src/main/resources/application.properties` with your MySQL username and password
3. Open a terminal in `backend`
4. Run `mvn clean package`
5. Run `mvn spring-boot:run`
6. The backend listens on `http://localhost:8080`

Seeded admin account:
- username: `admin`
- password: `admin123`

## Frontend

1. Open a terminal in `frontend`
2. Run `npm install`
3. Run `npm run dev`
4. The app opens on `http://localhost:5173`

## Features included

- Tailwind CSS-powered modern UI
- MySQL persistence for backend user data
- JWT authentication for secure login
- Role-based admin endpoints
- Home page, login page, and admin user management panel
