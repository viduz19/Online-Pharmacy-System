# Viduz Pharmacy - Premium Online Pharmacy System

## 🏥 Project Overview

Viduz Pharmacy is a comprehensive, premium web-based online pharmacy system designed for the Sri Lankan market. The platform features a state-of-the-art user interface with role-based branding, enabling customers to purchase over-the-counter (OTC) medicines and request prescription-required medications through a secure verification process.

### ✨ Key Features

- **Unified Branding System**: Official logo integrated across all navigation and sidebar headers.
- **Role-Based Dynamic Themes**:
  - 🔵 **Admin Dashboard**: Professional Blue Theme
  - 🟡 **Pharmacist Dashboard**: Clinical Yellow/Amber Theme
  - 🟢 **Customer Dashboard**: Health-focused Green Theme
- **Premium UI/UX**: Built with the **Inter** font family, featuring glassmorphism, responsive layouts, and modern micro-animations.
- **Smart Product Catalog**: Sri Lankan pharmacy products with OTC and prescription-required classifications.
- **Prescription Workflow**: Secure upload, pharmacist review, price calculation, and order confirmation.
- **Real-time Order Tracking**: Complete lifecycle tracking from "Pending Review" to "Delivered".

## 👥 User Roles & Themes

### 🟢 Customer (Green Theme)
- Self-registration with immediate activation.
- Premium browsing experience for OTC and Prescription medicines.
- Shopping cart with real-time total calculation.
- Secure prescription upload for verified medication requests.
- Track orders through a modern, green-themed dashboard.

### 🟡 Pharmacist (Yellow Theme)
- Professional dashboard for clinical management.
- Review prescription uploads with approve/reject capabilities.
- Calculate totals for prescription orders.
- Update inventory and manage stock levels.

### 🔵 Admin (Blue Theme)
- Full system oversight via a professional blue-themed dashboard.
- Approve pharmacist registrations.
- Manage products, categories, and site-wide settings.
- View comprehensive analytics and system audit logs.

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - High-performance build tool
- **Tailwind CSS** - Utility-first styling for premium design
- **Lucide React** - High-quality iconography
- **Axios** - API communication
- **Context API** - State management for Cart and Auth
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js & Express.js** - Scalable server environment
- **MongoDB Atlas** - Cloud-based NoSQL database
- **Mongoose** - Advanced ODM for MongoDB
- **JWT** - Secure, role-based authentication
- **Multer** - Multipart file upload handling

## 📁 Project Structure

```
viduz-pharmacy/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── assets/        # Official Logo & Hero Images
│   │   ├── components/    # Reusable UI & Layout components
│   │   ├── context/       # Auth & Cart State
│   │   ├── pages/         # Dashboard & Public pages
│   │   ├── services/      # API Service Layer
│   │   └── routes/        # App routing
│
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Business Logic
│   │   ├── models/        # Database Schema (8 Models)
│   │   ├── routes/        # API Endpoints
│   │   └── middleware/    # Auth & File Handling
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Connection
- Official Assets (Logo & Hero Image)

### Installation & Run

1. **Clone & Install**
```bash
git clone <repository-url>
# Install Server
cd server && npm install
# Install Client
cd ../client && npm install
```

2. **Environment Configuration**
Create `.env` in `server/` with:
- `MONGODB_URI`, `JWT_SECRET`, `PORT=5000`

3. **Start Development**
```bash
# Terminal 1 (Server)
cd server && npm run dev
# Terminal 2 (Client)
cd client && npm run dev
```

## 📈 Order Lifecycle

`Pending Review` → `Approved` → `Awaiting Payment` → `Paid` → `Preparing` → `Ready for Delivery` → `Delivered`

## 👨‍💻 Author

**Vidusha Puswalkatiya**

---

**Note**: This project is an academic Final Year Project for BSc. It emphasizes a premium user experience and a professional pharmaceutical workflow customized for the Sri Lankan market.
