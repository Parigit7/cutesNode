# Cutes.lk Management App

A modern React + Express.js starter app for Cutes.lk using a black, white, and #d59ca3 theme.

## Backend

1. Install MongoDB and ensure it is running (default connection: `mongodb://localhost:27017/cuteslkdb`)
2. Configure settings inside `backend/.env` if your MongoDB connection URI or port differs.
3. Open a terminal in `backend`
4. Run `npm install`
5. Run `npm start` (or `npm run dev` with nodemon)
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
- MongoDB persistence for backend catalog, orders, categories, and user data
- JWT authentication for secure login
- Role-based admin, sales, and packing endpoints
- Home page, login page, and admin user management panel

