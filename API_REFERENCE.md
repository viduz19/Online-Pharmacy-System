# 🌐 API Reference — Viduz Pharmacy System

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Routes (`/api/auth`)

| Method | Endpoint              | Auth     | Description                    |
|--------|-----------------------|----------|--------------------------------|
| POST   | `/auth/register`      | Public   | Register a new user            |
| POST   | `/auth/login`         | Public   | Login and get JWT token        |
| GET    | `/auth/me`            | User     | Get current logged-in user     |
| PUT    | `/auth/profile`       | User     | Update profile info            |
| PUT    | `/auth/change-password` | User   | Change account password        |

---

## 🛍️ Product Routes (`/api/products`)

| Method | Endpoint              | Auth     | Description                    |
|--------|-----------------------|----------|--------------------------------|
| GET    | `/products`           | Public   | Get all active products        |
| GET    | `/products/:id`       | Public   | Get single product             |
| POST   | `/products`           | Admin/Pharmacist | Create new product  |
| PUT    | `/products/:id`       | Admin/Pharmacist | Update product      |
| DELETE | `/products/:id`       | Admin    | Delete product                 |

---

## 🗂️ Category Routes (`/api/categories`)

| Method | Endpoint              | Auth     | Description                    |
|--------|-----------------------|----------|--------------------------------|
| GET    | `/categories`         | Public   | Get all categories             |

---

## 📦 Order Routes (`/api/orders`)

| Method | Endpoint                      | Auth       | Description                        |
|--------|-------------------------------|------------|------------------------------------|
| POST   | `/orders`                     | Customer   | Create a new order (OTC)           |
| GET    | `/orders/my-orders`           | Customer   | Get all orders for current user    |
| GET    | `/orders/:id`                 | User       | Get a specific order               |
| PATCH  | `/orders/:id/status`          | Pharmacist | Update order status                |
| GET    | `/orders/pharmacist/all`      | Pharmacist | Get all orders (pharmacist view)   |
| GET    | `/orders/admin/all`           | Admin      | Get all orders (admin view)        |

---

## 📋 Prescription Routes (`/api/prescriptions`)

| Method | Endpoint                           | Auth       | Description                            |
|--------|------------------------------------|------------|----------------------------------------|
| POST   | `/prescriptions`                   | Customer   | Submit a new prescription              |
| GET    | `/prescriptions/my`                | Customer   | Get customer's prescriptions           |
| GET    | `/prescriptions/:id`               | User       | Get a single prescription              |
| GET    | `/prescriptions/pharmacist/pending` | Pharmacist | Get pending prescriptions             |
| PATCH  | `/prescriptions/:id/status`        | Pharmacist | Approve/Reject with quote              |
| POST   | `/prescriptions/:id/order`         | Customer   | Convert approved prescription to order |

---

## 👨‍⚕️ Pharmacist Routes (`/api/pharmacist`)

| Method | Endpoint                      | Auth       | Description                          |
|--------|-------------------------------|------------|--------------------------------------|
| GET    | `/pharmacist/dashboard`       | Pharmacist | Get pharmacist dashboard stats       |
| GET    | `/pharmacist/prescriptions`   | Pharmacist | Get all prescriptions                |

---

## 🛡️ Admin Routes (`/api/admin`)

### User Management
| Method | Endpoint                        | Auth  | Description                        |
|--------|---------------------------------|-------|------------------------------------|
| GET    | `/admin/users`                  | Admin | Get all users                      |
| GET    | `/admin/customers`              | Admin | Get all customers                  |
| PATCH  | `/admin/users/:id/status`       | Admin | Activate / deactivate a user       |

### Pharmacist Management
| Method | Endpoint                            | Auth  | Description                         |
|--------|-------------------------------------|-------|-------------------------------------|
| GET    | `/admin/pharmacists`                | Admin | Get all pharmacists                 |
| GET    | `/admin/pharmacists/pending`        | Admin | Get pending approval requests       |
| PATCH  | `/admin/pharmacists/:id/approval`   | Admin | Approve or reject a pharmacist      |

### Dashboard & Reports
| Method | Endpoint                     | Auth  | Description                |
|--------|------------------------------|-------|----------------------------|
| GET    | `/admin/dashboard/stats`     | Admin | Get system-wide stats      |
| GET    | `/admin/reports/sales`       | Admin | Get sales report data      |
| GET    | `/admin/audit-logs`          | Admin | Get admin audit logs       |

### Category Management
| Method | Endpoint                  | Auth  | Description             |
|--------|---------------------------|-------|-------------------------|
| GET    | `/admin/categories`       | Admin | Get all categories      |
| POST   | `/admin/categories`       | Admin | Create a new category   |
| PUT    | `/admin/categories/:id`   | Admin | Update a category       |
| DELETE | `/admin/categories/:id`   | Admin | Delete a category       |

---

## 📤 File Uploads

Prescription images are uploaded to **Cloudinary** via `multipart/form-data`.

Required field name: `prescriptionImage`

---
