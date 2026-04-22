# Inventory Management System (IMS)

A full-stack Inventory Management System built with **Laravel (Backend)** and **React (Frontend)**.

## Features
- **Secure Authentication**: Laravel Sanctum with Bearer tokens.
- **Role-Based Access Control (RBAC)**: Admin, Manager, and Staff roles.
- **Product Management**: Full CRUD with stock tracking and low-stock alerts.
- **Category & Supplier Management**: Organize inventory effectively.
- **Inventory Transactions**: Record Stock-In (Purchases) and Stock-Out (Sales/Usage) with automatic stock updates.
- **Negative Inventory Prevention**: Logic to prevent selling more than available.
- **Dashboard Analytics**: Key metrics and visual charts (Recharts).
- **Reporting**: CSV export for inventory data.
- **Modern UI/UX**: Responsive design with Vanilla CSS and Lucide icons.

## Setup Instructions

### Backend (Laravel)
1. Navigate to the `backend` directory.
2. Install dependencies: `composer install`.
3. Create database: The system uses SQLite by default (`database/database.sqlite`).
4. Run migrations and seeders:
   ```bash
   php artisan migrate
   php artisan db:seed --class=AdminUserSeeder
   ```
5. Start the server: `php artisan serve`.

### Frontend (React)
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.
4. Access the app at `http://localhost:5173` (or the port shown in terminal).

### Default Credentials
- **Email**: `admin@ims.com`
- **Password**: `password`
- **Role**: Admin

## Technologies Used
- **Backend**: Laravel 11/12, Sanctum, Eloquent ORM, SQLite.
- **Frontend**: React (Vite), Context API, React Router, Axios, Recharts, Lucide Icons, React Toastify.
