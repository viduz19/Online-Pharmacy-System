# 💊 Viduz Pharmacy System

A full-stack online pharmacy management system built for **Viduz Pharmacy**, located at No 143, High Level Road, Nugegoda, Sri Lanka. The system enables customers to purchase OTC medicines, upload prescriptions, and track orders — all reviewed by certified pharmacists.

---

## 🏗️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React 18, Vite, TailwindCSS          |
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB with Mongoose                |
| Auth       | JWT (JSON Web Tokens)                |
| File Upload| Cloudinary                           |
| Realtime   | WhatsApp (via direct link)           |
| Icons      | Lucide React                         |
| Toasts     | react-hot-toast                      |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### 1. Clone & Install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers

```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000/api

---

## 👥 User Roles

| Role        | Access                                                                 |
|-------------|------------------------------------------------------------------------|
| **Customer**    | Browse products, cart, checkout, upload prescriptions, view orders |
| **Pharmacist**  | Review prescriptions, manage orders, manage inventory             |
| **Admin**       | Full system access: users, pharmacists, products, reports         |

---

## 📁 Project Structure

```
Online-Pharmacy-System/
├── client/                     # React Frontend (Vite)
│   └── src/
│       ├── assets/             # Images and static files
│       ├── components/         # Shared layout components
│       │   ├── layout/         # CustomerLayout, PharmacistLayout, AdminLayout
│       │   └── admin/          # Admin-specific modal components
│       ├── context/            # CartContext, AuthContext
│       ├── pages/              # All 31 page components
│       ├── routes/             # AppRoutes.jsx
│       └── services/           # api.service.js (all API calls)
│
└── server/                     # Express Backend
    └── src/
        ├── controllers/        # Business logic
        ├── models/             # Mongoose schemas
        ├── routes/             # API route definitions
        └── middleware/         # auth, upload middleware
```

---

## 📄 Pages Overview

### Public Pages
| Page | Route |
|------|-------|
| Home | `/` |
| About | `/about` |
| Products | `/products` |
| Login | `/login` |
| Register | `/register` |
| Cart | `/cart` |

### Customer Portal (`/customer/`)
| Page | Route |
|------|-------|
| Dashboard | `/customer/dashboard` |
| Orders | `/customer/orders` |
| Order Detail | `/customer/orders/:orderId` |
| Prescriptions | `/customer/prescriptions` |
| Prescription Detail | `/customer/prescriptions/:id` |
| Upload Prescription | `/customer/upload-prescription` |
| Profile | `/customer/profile` |
| Settings | `/customer/settings` |
| Help | (via CustomerLayout) |

### Pharmacist Portal (`/pharmacist/`)
| Page | Route |
|------|-------|
| Dashboard | `/pharmacist/dashboard` |
| Pending Prescriptions | `/pharmacist/prescriptions/pending` |
| Approved Prescriptions | `/pharmacist/prescriptions/approved` |
| Rejected Prescriptions | `/pharmacist/prescriptions/rejected` |
| Orders | `/pharmacist/orders` |
| Inventory | `/pharmacist/products` |
| Profile | `/pharmacist/profile` |
| Settings | `/pharmacist/settings` |

### Admin Portal (`/admin/`)
| Page | Route |
|------|-------|
| Dashboard | `/admin/dashboard` |
| Products | `/admin/products` |
| Orders | `/admin/orders` |
| Prescriptions | `/admin/prescriptions` |
| Customers | `/admin/users` |
| Pharmacists | `/admin/pharmacists` |
| Revenue | `/admin/revenue` |
| Reports | `/admin/reports` |
| Profile | `/admin/profile` |
| Settings | `/admin/settings` |

---

## 🔑 Test Accounts

| Role        | Email                        | Password   |
|-------------|------------------------------|------------|
| Admin       | admin@viduzpharmacy.lk       | admin123   |
| Pharmacist  | pharmacist@viduzpharmacy.lk  | pharma123  |
| Pharmacist  | puswalkatiyasandu@gmail.com  | Hiru@22    |
| Customer    | customer@viduzpharmacy.lk    | cust123    |
| Customer    | sandunividusha9@gmail.com    | Tharu@16   |

---

## 📍 Developer Details

- **Name:** Vidusha Puswalkatiya
- **Email:** sandunividusha9@gmail.com
