# Viduz Pharmacy - Online Pharmacy System

## 🏥 Project Overview

Viduz Pharmacy is a comprehensive web-based online pharmacy system designed for the Sri Lankan market. The platform enables customers to purchase over-the-counter (OTC) medicines and request prescription-required medications through a secure prescription upload and verification process.

### Key Features

- **Multi-Role System**: Customer, Pharmacist, Admin, and Delivery Rider (future scope)
- **Smart Product Catalog**: Sri Lankan pharmacy products with OTC and prescription-required classifications
- **Prescription Verification**: Secure upload and pharmacist review workflow
- **Order Management**: Complete order lifecycle from request to delivery-ready status
- **Admin Controls**: Product management, user approvals, and system oversight
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS

## 👥 User Roles

### Customer
- Self-registration with immediate account activation
- Browse and search products
- Purchase OTC medicines directly
- Request prescription medicines with file upload
- Track order status and receive notifications

### Pharmacist
- Self-registration with admin approval required
- Review and approve/reject prescription requests
- Prepare orders and calculate totals
- Send price confirmations to customers
- Update order statuses

### Admin
- Pre-created account (no public registration)
- Approve pharmacist registrations
- Manage products, categories, and inventory
- Manage users and system settings
- View reports and audit logs

### Delivery Rider (Future Development)
- View assigned deliveries
- Update delivery status
- Proof of delivery (OTP/signature)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form validation
- **Zustand** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## 📁 Project Structure

```
viduz-pharmacy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── routes/        # Route configuration
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── package.json
│
└── docs/                 # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd viduz-pharmacy
```

2. **Backend Setup**
```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

3. **Frontend Setup**
```bash
cd client
npm install
```

Create `.env` file in client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start Backend Server**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

2. **Start Frontend Development Server**
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📊 Database Models

### Core Models
- **User** - Base user information with role and status
- **PharmacistProfile** - Extended pharmacist details (license, NIC)
- **Product** - Medicine catalog with pricing and stock
- **Category** - Product categorization
- **Order** - Order information and status tracking
- **OrderItem** - Individual items in orders
- **Prescription** - Uploaded prescription files
- **Message** - Customer-pharmacist communication
- **AuditLog** - System activity tracking

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes for each user role
- Secure password hashing with bcrypt

## 📱 Key User Journeys

### Customer Journey
1. Register account (immediate activation)
2. Browse products and search
3. Add OTC items to cart and checkout
4. Upload prescription for prescription-required medicines
5. Receive price confirmation from pharmacist
6. Complete payment
7. Track order status

### Pharmacist Journey
1. Register with professional details
2. Wait for admin approval
3. Review prescription requests
4. Approve/reject prescriptions
5. Prepare orders and calculate totals
6. Update order statuses

### Admin Journey
1. Login with pre-created credentials
2. Approve pharmacist registrations
3. Manage product catalog
4. Monitor orders and users
5. View reports and audit logs

## 🏪 Sample Product Catalog (Sri Lankan Market)

### OTC Products
- Panadol (Paracetamol 500mg)
- Samahan sachets
- Piriton (Chlorpheniramine)
- ORS packets
- Dettol antiseptic liquid
- Vitamin C tablets

### Prescription Required
- Amoxicillin 500mg
- Azithromycin 500mg
- Metformin 500mg
- Amlodipine 5mg
- Atorvastatin 10mg
- Omeprazole 20mg

## 📈 Order Status Flow

```
Pending Review → Approved → Awaiting Payment → Paid → Preparing → Ready for Delivery
```

## 🔮 Future Development Scope

- **Delivery Rider Module**
  - Rider assignment to orders
  - Live tracking
  - Delivery confirmation with OTP
  - Proof of delivery (photo/signature)
- **Payment Gateway Integration**
- **SMS/Email Notifications**
- **Cloud Storage for Prescriptions** (AWS S3/Cloudinary)
- **Advanced Analytics Dashboard**
- **Mobile Application**

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📝 API Documentation

API documentation is available at `/api/docs` when running the development server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vidusha Puswalkatiya**

## 🙏 Acknowledgments

- Sri Lankan Pharmacy Council for regulatory guidelines
- Medical professionals for prescription verification workflows
- Open-source community for amazing tools and libraries

---

**Note**: This is a University academic Final project for BSc final year. The delivery rider module is planned for future development.
