# 🎉 Ananta Event Management System

A full-stack **Event Management System** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). The platform connects **Admins**, **Vendors**, and **Users** in a unified workflow — vendors list event-related products/services, users browse and place orders, and admins oversee the entire ecosystem.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Seed the Admin Account](#4-seed-the-admin-account)
  - [5. Run the Application](#5-run-the-application)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Auth Routes](#auth-routes)
  - [Admin Routes](#admin-routes)
  - [Vendor Routes](#vendor-routes)
  - [User Routes](#user-routes)
- [Features](#features)
  - [Admin Panel](#admin-panel)
  - [Vendor Portal](#vendor-portal)
  - [User Portal](#user-portal)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [License](#license)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                   React + React Router + Axios               │
│                     Tailwind CSS Styling                     │
└────────────────────────────┬─────────────────────────────────┘
                             │  HTTP (REST API)
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                      │
│                                                              │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────────┐    │
│  │  Routes   │→│ Middleware   │→│   Controllers          │    │
│  │          │  │ (JWT Auth,  │  │ (Business Logic)      │    │
│  │ /api/auth│  │  RBAC,      │  │                        │    │
│  │ /api/admin│ │  Error      │  │ authController         │    │
│  │ /api/vendor│ │  Handler)  │  │ adminController        │    │
│  │ /api/user│  │             │  │ vendorController       │    │
│  └──────────┘  └─────────────┘  │ userController         │    │
│                                  └───────────┬────────────┘    │
│                                              │                │
│                                  ┌───────────▼────────────┐    │
│                                  │   Mongoose Models       │    │
│                                  │   (User, Product,       │    │
│                                  │    Order)                │    │
│                                  └───────────┬────────────┘    │
└──────────────────────────────────────────────┼────────────────┘
                                               │
                                               ▼
                                  ┌────────────────────────┐
                                  │      MongoDB Atlas      │
                                  │   (or local MongoDB)    │
                                  └────────────────────────┘
```

---

## Tech Stack

| Layer        | Technology                                                     |
| ------------ | -------------------------------------------------------------- |
| **Frontend** | React 18, React Router v6, Axios, React Toastify, React Icons |
| **Styling**  | Tailwind CSS v4 (via Vite plugin)                              |
| **Build**    | Vite 6                                                         |
| **Backend**  | Node.js, Express.js 4                                          |
| **Database** | MongoDB (Mongoose 7 ODM)                                       |
| **Auth**     | JSON Web Tokens (JWT), bcrypt.js                               |
| **Uploads**  | Multer (file uploads for product images)                       |

---

## Folder Structure

```
ananta-event-management/
│
├── backend/                          # Express.js REST API
│   ├── config/
│   │   ├── db.js                     # MongoDB connection handler
│   │   └── multer.js                 # Multer file-upload configuration
│   │
│   ├── controllers/
│   │   ├── adminController.js        # Admin business logic
│   │   ├── authController.js         # Register / Login / Get-Me
│   │   ├── userController.js         # User business logic
│   │   └── vendorController.js       # Vendor business logic
│   │
│   ├── middleware/
│   │   ├── auth.js                   # JWT authentication & RBAC authorization
│   │   └── errorHandler.js           # Global error handler
│   │
│   ├── models/
│   │   ├── Order.js                  # Order schema (items, shipping, status)
│   │   ├── Product.js                # Product schema (vendor items)
│   │   └── User.js                   # User schema (admin / vendor / user)
│   │
│   ├── routes/
│   │   ├── admin.js                  # /api/admin/*
│   │   ├── auth.js                   # /api/auth/*
│   │   ├── user.js                   # /api/user/*
│   │   └── vendor.js                 # /api/vendor/*
│   │
│   ├── uploads/                      # Uploaded product images (git-ignored)
│   ├── package.json
│   ├── seed.js                       # Seeds default admin account
│   └── server.js                     # App entry point
│
├── frontend/                         # React SPA (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Loader.jsx            # Loading spinner
│   │   │   ├── Modal.jsx             # Reusable modal dialog
│   │   │   ├── Navbar.jsx            # Top navigation bar
│   │   │   └── ProtectedRoute.jsx    # Role-based route guard
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state (login, logout, token)
│   │   │   └── CartContext.jsx       # Shopping cart state
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/                # Admin dashboard & CRUD pages
│   │   │   ├── auth/                 # Login & Signup pages (3 roles)
│   │   │   ├── user/                 # User shopping & guest-list pages
│   │   │   └── vendor/               # Vendor product & order pages
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance with interceptors
│   │   │   └── endpoints.js          # Centralized API endpoint constants
│   │   │
│   │   ├── styles/
│   │   │   └── global.css            # Global / Tailwind base styles
│   │   │
│   │   ├── App.jsx                   # Root component with route definitions
│   │   └── main.jsx                  # React DOM entry point
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                # Vite config (API proxy, plugins)
│
├── .gitignore
└── README.md
```

---

## Prerequisites

| Requirement  | Version |
| ------------ | ------- |
| **Node.js**  | ≥ 18.x  |
| **npm**      | ≥ 9.x   |
| **MongoDB**  | ≥ 6.x (local) or MongoDB Atlas (cloud) |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/ananta-event-management.git
cd ananta-event-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_jwt_secret_key
```

> Replace `MONGODB_URI` with your MongoDB Atlas connection string for production.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically via `vite.config.js`.

### 4. Seed the Admin Account

Run the seed script **once** to create the default admin:

```bash
cd ../backend
node seed.js
```

Default admin credentials:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `admin@eventmgmt.com` |
| Password | `admin123`            |

> **Change the password immediately in production.**

### 5. Run the Application

Open **two terminals**:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev          # starts with nodemon on port 5000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev          # starts Vite on port 5173
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

| Variable       | Required | Description                              | Default |
| -------------- | -------- | ---------------------------------------- | ------- |
| `PORT`         | No       | Port the Express server listens on       | `5000`  |
| `MONGODB_URI`  | Yes      | MongoDB connection string                | —       |
| `JWT_SECRET`   | Yes      | Secret key used to sign JWT tokens       | —       |

---

## API Reference

All routes are prefixed with `/api`. Protected routes require a `Bearer <token>` header.

### Auth Routes

| Method | Endpoint         | Access | Description                   |
| ------ | ---------------- | ------ | ----------------------------- |
| POST   | `/api/auth/register` | Public | Register a new user/vendor    |
| POST   | `/api/auth/login`    | Public | Login and receive JWT token   |
| GET    | `/api/auth/me`       | Auth   | Get current authenticated user |

### Admin Routes

> All require `admin` role.

| Method | Endpoint                          | Description                  |
| ------ | --------------------------------- | ---------------------------- |
| GET    | `/api/admin/dashboard`            | Dashboard statistics         |
| GET    | `/api/admin/vendors`              | List all vendors             |
| POST   | `/api/admin/vendors`              | Add a new vendor             |
| GET    | `/api/admin/vendors/:id`          | Get vendor by ID             |
| PUT    | `/api/admin/vendors/:id`          | Update vendor details        |
| PUT    | `/api/admin/vendors/:id/membership` | Update vendor membership   |
| PUT    | `/api/admin/vendors/:id/extend`   | Extend vendor membership     |
| PUT    | `/api/admin/vendors/:id/cancel`   | Cancel vendor membership     |
| DELETE | `/api/admin/vendors/:id`          | Delete a vendor              |
| GET    | `/api/admin/users`                | List all users               |
| POST   | `/api/admin/users`                | Add a new user               |
| PUT    | `/api/admin/users/:id`            | Update user details          |
| DELETE | `/api/admin/users/:id`            | Delete a user                |

### Vendor Routes

> All require `vendor` role.

| Method | Endpoint                          | Description                  |
| ------ | --------------------------------- | ---------------------------- |
| GET    | `/api/vendor/dashboard`           | Vendor dashboard stats       |
| GET    | `/api/vendor/products`            | List vendor's own products   |
| GET    | `/api/vendor/products/:id`        | Get single product           |
| POST   | `/api/vendor/products`            | Add product (multipart/form) |
| PUT    | `/api/vendor/products/:id`        | Update product               |
| DELETE | `/api/vendor/products/:id`        | Delete product               |
| GET    | `/api/vendor/orders`              | View orders containing vendor's products |
| PUT    | `/api/vendor/orders/:id/status`   | Update order status          |

### User Routes

> All require `user` role.

| Method | Endpoint                              | Description               |
| ------ | ------------------------------------- | ------------------------- |
| GET    | `/api/user/vendors`                   | Browse active vendors     |
| GET    | `/api/user/vendors/:id/products`      | View vendor's products    |
| POST   | `/api/user/orders`                    | Place a new order         |
| GET    | `/api/user/orders`                    | List user's orders        |
| GET    | `/api/user/orders/:id`                | Get order details         |
| GET    | `/api/user/guests`                    | View guest list           |
| POST   | `/api/user/guests`                    | Add a guest               |
| PUT    | `/api/user/guests/:guestId`           | Update a guest            |
| DELETE | `/api/user/guests/:guestId`           | Delete a guest            |

---

## Features

### Admin Panel

| Feature               | Page              | Description                                                 |
| --------------------- | ----------------- | ----------------------------------------------------------- |
| **Dashboard**         | `/admin/dashboard` | Overview cards — total vendors, users, orders, revenue      |
| **Manage Vendors**    | `/admin/vendors`   | View, add, update, delete vendors; manage membership tenure |
| **Manage Users**      | `/admin/users`     | View, add, update, delete registered users                  |
| **Membership Control**| —                  | Extend or cancel vendor memberships with date tracking      |

### Vendor Portal

| Feature              | Page                    | Description                                           |
| -------------------- | ----------------------- | ----------------------------------------------------- |
| **Dashboard**        | `/vendor/dashboard`     | Sales summary, product count, recent orders            |
| **Add Item**         | `/vendor/add-item`      | Create a new product with image upload                 |
| **Your Items**       | `/vendor/your-items`    | List of all products with edit/delete                  |
| **View Product**     | `/vendor/view-product/:id` | Detailed product view                              |
| **Request Item**     | `/vendor/request-item`  | Request or suggest new product listings                |
| **Product Status**   | `/vendor/product-status`| Track product availability status                      |
| **Transactions**     | `/vendor/transactions`  | View received orders; update order status              |

### User Portal

| Feature            | Page                      | Description                                        |
| ------------------ | ------------------------- | -------------------------------------------------- |
| **Dashboard**      | `/user/dashboard`         | User overview and quick links                      |
| **Browse Vendors** | `/user/vendors`           | List of active vendors with category filtering     |
| **Shop Items**     | `/user/shop/:vendorId`    | Browse and add products from a specific vendor     |
| **Cart**           | `/user/cart`              | Review items, adjust quantities, remove items      |
| **Checkout**       | `/user/checkout`          | Enter shipping details, select payment method (Cash/UPI), place order |
| **Order Status**   | `/user/orders`            | Track order progress (Ordered → Delivered)         |
| **Guest List**     | `/user/guest-list`        | Manage event guest list (add, update, delete guests) |

---

## Database Models

### User

| Field             | Type       | Notes                                                  |
| ----------------- | ---------- | ------------------------------------------------------ |
| `name`            | String     | Required                                               |
| `email`           | String     | Required, unique                                       |
| `password`        | String     | Hashed with bcrypt before save                         |
| `phone`           | String     | Optional                                               |
| `role`            | Enum       | `admin` · `vendor` · `user`                            |
| `vendorCategory`  | Enum       | Caterer, Decorator, Photographer, DJ, Venue, etc.       |
| `membershipStart` | Date       | Vendor membership start date                           |
| `membershipEnd`   | Date       | Vendor membership end date                             |
| `membershipMonths`| Number     | Duration in months                                     |
| `guestList`       | [Guest]    | Embedded array (name, email, phone, relation)          |
| `isActive`        | Boolean    | Soft-delete / deactivation flag                        |

### Product

| Field      | Type       | Notes                              |
| ---------- | ---------- | ---------------------------------- |
| `vendorId` | ObjectId   | Reference to the vendor (User)     |
| `name`     | String     | Required                           |
| `price`    | Number     | Required, ≥ 0                      |
| `image`    | String     | File path / URL                    |
| `status`   | Enum       | `Available` · `Unavailable`        |

### Order

| Field            | Type       | Notes                                              |
| ---------------- | ---------- | -------------------------------------------------- |
| `userId`         | ObjectId   | Reference to the ordering user                     |
| `items`          | [Item]     | Embedded array (productId, vendorId, name, price, qty, image) |
| `totalAmount`    | Number     | Required, ≥ 0                                     |
| `status`         | Enum       | `Ordered` → `Received` → `Ready for Shipping` → `Out For Delivery` → `Delivered` |
| `paymentMethod`  | Enum       | `Cash` · `UPI`                                     |
| `shippingAddress`| Object     | `{ address, city, pincode }`                       |

---

## Authentication & Authorization

1. **Registration / Login** — Returns a JWT token stored in `localStorage`.
2. **Axios Interceptor** — Automatically attaches `Authorization: Bearer <token>` to every request.
3. **Backend Middleware** — `authenticate` verifies the token; `authorize(role)` enforces role-based access.
4. **Frontend Guards** — `<ProtectedRoute role="...">` redirects unauthorized users to the login page.

**Role hierarchy:**

```
Admin   → Full CRUD on vendors & users, dashboard analytics
Vendor  → Manage own products, view & update order statuses
User    → Browse vendors, shop, cart, checkout, track orders, manage guest list
```

---

## License

This project is for educational / personal use.
