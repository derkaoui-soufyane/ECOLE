# Full Stack Web Application (Laravel + React)

## 📌 Project Description
This is a full-stack web application built using Laravel for the backend and React.js for the frontend.  
The project allows users to perform CRUD operations, authentication, and interact with a REST API.

----

## ⚙️ Technologies Used

### Backend
- Laravel 11
- MySQL Database
- Laravel Sanctum (Authentication)
- REST API

### Frontend
- React.js
- Axios
- React Router DOM
- Tailwind CSS / Bootstrap

----

## 📁 Project Structure

project-root/
├── backend/   (Laravel API)
└── frontend/  (React App)

----

## 🚀 Features

- User registration and login
- Authentication with token (Sanctum)
- CRUD operations (Create, Read, Update, Delete)
- API communication between frontend and backend
- Responsive UI

----

## 🛠️ Installation Guide

### 1. Clone the project
git clone https://github.com/your-username/your-project.git

---

## 🔧 Backend Setup (Laravel)

cd backend
composer install
cp .env.example .env
php artisan key:generate

### Configure database in .env
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

### Run migrations
php artisan migrate

### Start server
php artisan serve

Backend runs on:
http://127.0.0.1:8000

---

## 🎨 Frontend Setup (React)

cd frontend
npm install
npm start

Frontend runs on:
http://localhost:3000

---

## 🔗 API Configuration

Make sure React connects to Laravel API:

const API_URL = "http://127.0.0.1:8000/api";

---

## 📌 Important Notes

- Enable CORS in Laravel
- Make sure .env file is configured correctly
- Run backend before frontend
- Use Sanctum for authentication
