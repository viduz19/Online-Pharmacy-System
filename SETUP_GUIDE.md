# Viduz Pharmacy - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB Community Server** (Local development)
- **MongoDB Compass** (Visual UI for DB)
- **Git**
- **Code Editor** (VS Code recommended)

## 🚀 Quick Start Guide

### Step 1: Local MongoDB Setup

1. **Install MongoDB Community Server**
   - Download and install from the [official website](https://www.mongodb.com/try/download/community).
   - Ensure "Install MongoDB as a Service" is checked.

2. **Verify Installation**
   - Open MongoDB Compass and connect to `mongodb://localhost:27017`.

### Step 2: Backend Setup

1. **Navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
Create a `.env` in `server/` with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Online-Pharmacy-System-1
JWT_SECRET=your_32_character_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

4. **Seed the database**
```bash
npm run seed
```

5. **Start the backend server**
```bash
npm run dev
```

### Step 3: Frontend Setup

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

## 🎨 Premium UI & Role-Based Branding

Viduz Pharmacy features a premium design system with role-specific themes:

- **🔵 Admin Dashboard**: Professional blue theme with full analytics.
- **🟡 Pharmacist Dashboard**: Clinical yellow/amber theme for review workflows.
- **🟢 Customer Dashboard**: Health-focused green theme for shopping and Rx tracking.

**Key Design Features:**
- **Typography**: Inter Font family.
- **Components**: Rounded-3xl corners and glassmorphism effects.
- **Logo**: Official system logo integrated across all roles.

## 🔑 Default Login Credentials

### Admin Account
- **Email:** admin@viduzpharmacy.lk
- **Password:** Admin@123

## 📁 Project Structure

```
viduz-pharmacy/
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/      # API Logic
│   │   ├── models/           # DB Schemas
│   │   ├── routes/           # Endpoints
│   │   └── server.js         # Entry point
│
└── client/                    # Frontend (React + Vite)
    ├── src/
    │   ├── assets/           # Official Logo & Imagery
    │   ├── components/       # Premium UI components
    │   ├── pages/            # Dashboard & Auth pages
    │   └── main.jsx          # Entry point
```

## 🧪 Testing the Application

### 1. Prescription Flow
1. **Customer**: Upload Rx image for a prescription product.
2. **Admin**: Approve a registered pharmacist.
3. **Pharmacist**: Review the Rx, set price, and approve.
4. **Customer**: View order, confirm price, and pay.

### 2. OTC Shopping
1. **Customer**: Add items like Panadol to cart and checkout immediately.

## 🛠️ Common Issues & Solutions

1. **Port 5000 Conflict**: If the port is in use, find the PID via `netstat -ano | findstr :5000` and kill it or change `PORT` in `.env`.
2. **MongoDB Connection**: Ensure the MongoDB service is running locally.

---

**Project Status:** 🟢 COMPLETE & PRODUCTION READY

**Last Updated:** April 24, 2026

**Developed by:** Viduz Pharmacy Development Team
