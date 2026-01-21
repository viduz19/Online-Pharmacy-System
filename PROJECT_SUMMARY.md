# Viduz Pharmacy - Project Summary

## 🎯 Project Overview

**Viduz Pharmacy Online System** is a comprehensive web-based pharmacy management platform designed specifically for the Sri Lankan market. The system enables customers to purchase over-the-counter (OTC) medicines directly and request prescription-required medications through a secure prescription upload and pharmacist verification workflow.

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
- Tailwind CSS (Styling)
- Zustand (State Management)
- Axios (HTTP Client)
- React Hook Form (Form Validation)
- React Hot Toast (Notifications)

## 👥 User Roles & Capabilities

### 1. Customer
**Registration:** Self-registration with immediate activation

**Capabilities:**
- Browse and search products
- Filter by category, price, prescription requirement
- Add OTC products to cart
- Direct checkout for OTC medicines
- Upload prescriptions for prescription-required medicines
- Track order status
- Receive price confirmations from pharmacists
- View order history
- Manage profile and addresses

**User Journey:**
1. Register → Browse Products → Add to Cart → Checkout (OTC)
2. Register → Find Prescription Medicine → Upload Prescription → Wait for Approval → Receive Price → Pay → Track Order

### 2. Pharmacist
**Registration:** Self-registration with admin approval required

**Required Information:**
- SLMC Registration/License Number
- NIC
- Qualifications
- Years of Experience
- Pharmacy Branch (optional)

**Capabilities:**
- Review pending prescription requests
- View uploaded prescription files
- Approve/Reject/Request re-upload
- Prepare orders (select medicines, confirm availability)
- Calculate total price (medicines + delivery)
- Send price confirmations to customers
- Update order statuses
- Manage stock levels

**User Journey:**
1. Register with Professional Details → Wait for Admin Approval → Login → Review Prescriptions → Approve & Set Price → Prepare Order → Mark Ready for Delivery

### 3. Admin
**Access:** Pre-created account (no public registration)

**Capabilities:**
- Approve/reject pharmacist registrations
- Manage products (add, edit, delete)
- Manage categories
- Update stock levels and pricing
- Manage users (activate/deactivate)
- View dashboard statistics
- Access audit logs
- Generate reports

**User Journey:**
1. Login → Approve Pharmacists → Manage Products → Monitor Orders → View Reports → Review Audit Logs

### 4. Delivery Rider (Future Scope)
**Planned Capabilities:**
- View assigned deliveries
- Update delivery status
- Mark orders as delivered
- Proof of delivery (OTP/Signature/Photo)

## 💊 Product Catalog

### Categories
1. Pain Relief
2. Antibiotics (Prescription Required)
3. Diabetes Care (Prescription Required)
4. Heart & Blood Pressure (Prescription Required)
5. Digestive Health
6. Vitamins & Supplements
7. Cold & Flu
8. First Aid & Wound Care
9. Herbal & Ayurvedic
10. Skin Care

### Sample Products

**OTC Products:**
- Panadol (Paracetamol 500mg) - Rs. 45
- Samahan (Herbal Tea) - Rs. 25
- Piriton (Chlorpheniramine 4mg) - Rs. 35
- ORS Sachets - Rs. 15
- Dettol Antiseptic Liquid - Rs. 450
- Vitamin C Tablets - Rs. 850
- Betadine Solution - Rs. 380
- Savlon Cream - Rs. 250

**Prescription Required:**
- Amoxicillin 500mg - Rs. 15
- Azithromycin 500mg - Rs. 85
- Metformin 500mg - Rs. 12
- Amlodipine 5mg - Rs. 18
- Atorvastatin 10mg - Rs. 22
- Omeprazole 20mg - Rs. 28

## 🔄 Core Workflows

### OTC Purchase Flow
```
Customer → Browse Products → Add to Cart → Checkout → 
Payment (COD/Online) → Order Created → Pharmacist Prepares → 
Ready for Delivery
```

### Prescription Medicine Flow
```
Customer → Find Prescription Medicine → Upload Prescription → 
Pharmacist Reviews → Approve/Reject → 
If Approved: Calculate Price → Send to Customer → 
Customer Pays → Pharmacist Prepares → Ready for Delivery
```

### Pharmacist Approval Flow
```
Pharmacist Registers → Provides License & NIC → 
Admin Reviews → Approve/Reject → 
If Approved: Pharmacist Can Access Dashboard
```

## 📊 Order Status Lifecycle

1. **PENDING_REVIEW** - Prescription uploaded, awaiting pharmacist review
2. **APPROVED** - Prescription approved by pharmacist
3. **AWAITING_PAYMENT** - Price confirmed, waiting for customer payment
4. **PAID** - Payment received/confirmed
5. **PREPARING** - Order being prepared by pharmacist
6. **READY_FOR_DELIVERY** - Order ready for pickup/delivery
7. **OUT_FOR_DELIVERY** - (Future) Rider has picked up order
8. **DELIVERED** - (Future) Order delivered to customer
9. **CANCELLED** - Order cancelled by customer
10. **REJECTED** - Prescription rejected by pharmacist

## 🔐 Security Features

### Authentication
- JWT-based stateless authentication
- Secure password hashing with bcrypt (10 rounds)
- Token expiration (7 days default)
- Protected routes with role-based access

### Authorization
- Role-based access control (RBAC)
- Middleware for route protection
- User status verification (ACTIVE/PENDING/BLOCKED)
- Pharmacist approval workflow

### Data Protection
- Prescription files stored securely
- Access restricted to authorized users only
- Audit logging for critical actions
- IP address and user agent tracking

## 📈 Database Schema

### Collections
1. **users** - All user accounts
2. **pharmacistprofiles** - Extended pharmacist information
3. **products** - Medicine catalog
4. **categories** - Product categories
5. **orders** - Order records
6. **prescriptions** - Uploaded prescription files
7. **messages** - Customer-pharmacist communication
8. **auditlogs** - System activity tracking

### Key Relationships
- User → PharmacistProfile (1:1)
- Order → Customer (N:1)
- Order → Prescription (1:1)
- Order → Pharmacist (N:1)
- Product → Category (N:1)
- Message → Sender/Recipient (N:1)

## 🎨 Frontend Features

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Responsive navigation
- Mobile-optimized forms

### User Experience
- Toast notifications for feedback
- Loading states
- Error handling
- Form validation
- Search and filter functionality
- Pagination for large datasets

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `PATCH /api/products/:id/stock` - Update stock (Admin/Pharmacist)

### Orders
- `POST /api/orders` - Create order (Customer)
- `GET /api/orders/my-orders` - Get customer orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - List all orders (Pharmacist/Admin)
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/cancel` - Cancel order (Customer)

### Prescriptions
- `POST /api/prescriptions` - Upload prescription (Customer)
- `GET /api/prescriptions/my-prescriptions` - Get customer prescriptions
- `GET /api/prescriptions/pending` - Get pending prescriptions (Pharmacist)
- `GET /api/prescriptions/:id` - Get prescription details
- `PATCH /api/prescriptions/:id/review` - Review prescription (Pharmacist)

### Admin
- `GET /api/admin/pharmacists/pending` - Get pending pharmacist approvals
- `PATCH /api/admin/pharmacists/:id/approval` - Approve/reject pharmacist
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/status` - Update user status
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/audit-logs` - Get audit logs
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

## 🚀 Deployment Considerations

### Backend Deployment
**Recommended Platforms:**
- Railway (Easy MongoDB integration)
- Heroku (Free tier available)
- DigitalOcean (Full control)
- AWS EC2 (Enterprise-grade)

**Requirements:**
- Node.js runtime
- MongoDB Atlas connection
- Environment variables
- File storage solution (AWS S3/Cloudinary)

### Frontend Deployment
**Recommended Platforms:**
- Vercel (Optimized for React)
- Netlify (Easy CI/CD)
- GitHub Pages (Free static hosting)

**Build Command:**
```bash
npm run build
```

### Database
- MongoDB Atlas (Already cloud-hosted)
- Upgrade to paid tier for production
- Enable backups
- Set up monitoring

## 📊 Project Statistics

**Backend:**
- 8 Database Models
- 5 Controllers
- 5 Route Files
- 3 Middleware Files
- 4 Utility Modules
- 16 Sample Products
- 10 Product Categories

**Code Quality:**
- RESTful API design
- MVC architecture
- Error handling
- Input validation
- Audit logging
- Comprehensive comments

## 🎯 Success Metrics

### Technical Metrics
- API response time < 200ms
- 99.9% uptime
- Zero security vulnerabilities
- Mobile responsive (100% pages)

### Business Metrics
- User registration rate
- Order completion rate
- Prescription approval time
- Customer satisfaction
- Pharmacist efficiency

## 🔮 Future Roadmap

### Phase 1 (Immediate)
- Complete frontend development
- Implement all dashboards
- Add comprehensive testing

### Phase 2 (Short-term)
- Payment gateway integration
- Email/SMS notifications
- Cloud file storage

### Phase 3 (Medium-term)
- Delivery rider module
- Real-time chat
- Mobile application

### Phase 4 (Long-term)
- AI-powered recommendations
- Prescription OCR
- Telemedicine integration
- Multi-branch support

## 📚 Documentation

- ✅ README.md - Project overview
- ✅ SETUP_GUIDE.md - Installation instructions
- ✅ ROADMAP.md - Development timeline
- ✅ PROJECT_SUMMARY.md - This document
- ⏳ API_DOCUMENTATION.md - API reference
- ⏳ USER_MANUAL.md - End-user guide
- ⏳ DEPLOYMENT_GUIDE.md - Production deployment

## 🎓 Academic Context

**Project Type:** BSc Final Year Project

**Domain:** Healthcare Technology / E-Commerce

**Key Learning Areas:**
- Full-stack web development
- RESTful API design
- Database modeling
- Authentication & authorization
- File upload handling
- Role-based access control
- State management
- Responsive design

**Technologies Demonstrated:**
- MERN Stack (MongoDB, Express, React, Node.js)
- JWT Authentication
- Cloud Database (MongoDB Atlas)
- Modern Frontend (React + Vite)
- CSS Framework (Tailwind)
- Version Control (Git)

## 💡 Key Innovations

1. **Prescription Verification Workflow**
   - Unique approval process
   - Pharmacist-customer communication
   - Price confirmation before payment

2. **Role-Based Dashboards**
   - Customized for each user type
   - Relevant information display
   - Efficient workflow management

3. **Sri Lankan Market Focus**
   - Local product catalog
   - Rupee pricing
   - Local pharmacy regulations

4. **Audit Trail System**
   - Complete action tracking
   - IP and user agent logging
   - Compliance and accountability

## 🏆 Project Strengths

1. **Comprehensive Scope**
   - Complete end-to-end solution
   - Multiple user roles
   - Real-world workflows

2. **Modern Technology**
   - Latest frameworks and libraries
   - Cloud-based infrastructure
   - Scalable architecture

3. **Security Focus**
   - JWT authentication
   - Role-based access
   - Audit logging
   - Secure file handling

4. **User-Centric Design**
   - Intuitive workflows
   - Clear status tracking
   - Responsive interface

5. **Extensibility**
   - Modular code structure
   - Easy to add features
   - Well-documented

---

**Project Status:** Backend Complete ✅ | Frontend In Progress 🚧

**Last Updated:** January 2026

**Developed by:** Viduz Pharmacy Development Team
