# Viduz Pharmacy - Project Summary

## 🎯 Project Overview

**Viduz Pharmacy Online System** is a comprehensive, premium web-based pharmacy management platform designed specifically for the Sri Lankan market. The system features a state-of-the-art user interface with role-based branding, enabling customers to purchase over-the-counter (OTC) medicines directly and request prescription-required medications through a secure prescription upload and pharmacist verification workflow.

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js v16+
- Express.js (RESTful API)
- MongoDB Atlas (Cloud Database)
- Mongoose (ODM)
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Multer (File Uploads)

**Frontend:**
- React 18
- Vite (Build Tool)
- React Router v6 (Routing)
- Tailwind CSS (Premium Styling)
- Lucide React (Iconography)
- Context API (State Management)
- Axios (HTTP Client)
- React Hot Toast (Notifications)

## 👥 User Roles & Capabilities

### 1. Customer (🟢 Green Theme)
**Branding:** Health-focused green palette with consistent official logo integration.

**Capabilities:**
- Premium Hero-section with high-quality medical imagery.
- Browse and search products with real-time filters.
- Shopping cart with persistent state and total calculation.
- Secure prescription upload with status tracking.
- Interactive green-themed dashboard for order management.
- WhatsApp integration for direct pharmacist communication.

### 2. Pharmacist (🟡 Yellow Theme)
**Branding:** Professional clinical yellow/amber palette with unified layout.

**Capabilities:**
- Review and verify prescription uploads.
- Calculate medicine prices and delivery totals.
- Update inventory and stock levels.
- Clinical dashboard for efficient order processing.

### 3. Admin (🔵 Blue Theme)
**Branding:** Institutional blue palette for system oversight.

**Capabilities:**
- Approve/reject pharmacist professional registrations.
- Full product catalog control (CRUD).
- Site-wide analytics and user status management.
- Professional blue-themed dashboard with deep analytics.

## 🎨 Premium UI/UX System

### Design Language
- **Typography**: Inter font family for high readability.
- **Components**: `rounded-3xl` for a modern, organic feel.
- **Aesthetics**: Glassmorphism (backdrop blur) in headers and sidebars.
- **Themes**: Role-specific color systems (Blue, Yellow, Green).
- **Icons**: Lucide React for consistent, high-quality visuals.

### Navigation & Layout
- **Unified Sidebar**: Consistent navigation structure across all user roles.
- **Sticky Navbar**: Backdropped blur effect for persistent accessibility.
- **Hero Section**: Responsive, dual-column hero layout with medical branding.

## 📊 Database Schema

### Collections
1. **users** - Role-based accounts with status.
2. **pharmacistprofiles** - Verification details (License, NIC).
3. **products** - medicine catalog with OTC/Rx flags.
4. **categories** - Hierarchical categorization.
5. **orders** - Full lifecycle tracking.
6. **prescriptions** - File-based requests.
7. **messages** - Role-to-role communication.
8. **auditlogs** - System accountability.

## 🔄 Core Workflows

### OTC Purchase Flow
`Customer → Products → Add to Cart → Checkout → Pay → Delivered`

### Prescription Medicine Flow
`Customer → Upload Rx → Pharmacist Review → Set Price → Pay → Delivered`

### Unified Branding Flow
`System Startup → Load Logo → Apply Role Color Theme → Render Unified Layout`

## 📊 Project Statistics

**Frontend Completion:**
- ✅ Auth Pages (Login/Register): 100%
- ✅ Home & Public Pages: 100%
- ✅ Dashboards (Admin/Pharmacist/Customer): 100%
- ✅ Design System (Inter/Tailwind): 100%

**Backend Completion:**
- ✅ Core API: 100%
- ✅ Database Models: 100%
- ✅ Security & Auth: 100%

## 🔮 Future Roadmap

- Payment gateway integration
- Email/SMS automated notifications
- Cloud file storage migration (AWS S3)
- Delivery rider real-time module
- Mobile-native application

---

**Project Status:** 🟢 COMPLETE & PRODUCTION READY

**Last Updated:** April 2026

**Developed by:** Vidusha Puswalkatiya
