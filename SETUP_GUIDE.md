# Viduz Pharmacy - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB Community Server** - [Download](https://www.mongodb.com/try/download/community)
- **MongoDB Compass** (GUI for MongoDB) - [Download](https://www.mongodb.com/try/download/compass)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## 🚀 Quick Start Guide

### Step 1: Local MongoDB Setup

1. **Install MongoDB Community Server**
   - Download and install from the [official website](https://www.mongodb.com/try/download/community).
   - During installation, ensure "Install MongoDB as a Service" is checked.

2. **Install MongoDB Compass (Optional but Recommended)**
   - Download and install [MongoDB Compass](https://www.mongodb.com/try/download/compass).
   - This provides a visual interface to manage your database.

3. **Verify Installation**
   - Open MongoDB Compass.
   - Use the default connection string: `mongodb://localhost:27017`
   - Click "Connect".
   - You don't need to manually create the database; the application will create it for you.

### Step 2: Backend Setup

1. **Navigate to server directory**
```bash
cd "E:/London Tec Degree/Final Year Project/Viduz Pharmacy/server"
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
Create a file named `.env` in the `server` directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Online-Pharmacy-System-1
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./src/uploads/prescriptions

# Admin Default Credentials
ADMIN_EMAIL=admin@viduzpharmacy.lk
ADMIN_PASSWORD=Admin@123
```

- `mongodb://localhost:27017/Online-Pharmacy-System-1` - Your local connection string
- `your_super_secret_jwt_key_min_32_characters_long` - Generate a random 32+ character string

4. **Seed the database**
```bash
npm run seed
```

This will create:
- Admin user
- Product categories
- Sample products (Sri Lankan pharmacy items)

5. **Start the backend server**
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database: Online-Pharmacy-System-1
🚀 Server running on port 5000
```

### Step 3: Frontend Setup

1. **Open a new terminal** (keep the backend running)

2. **Navigate to client directory**
```bash
cd "E:/London Tec Degree/Final Year Project/Viduz Pharmacy/client"
```

3. **Install dependencies**
```bash
npm install
```

4. **Start the development server**
```bash
npm run dev
```

You should see:
```
  VITE v5.0.12  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

5. **Open your browser**
Navigate to: `http://localhost:5173`

## 🔑 Default Login Credentials

### Admin Account
- **Email:** admin@viduzpharmacy.lk
- **Password:** Admin@123

### Test Accounts
You can register new accounts for:
- **Customer** - Immediate access after registration
- **Pharmacist** - Requires admin approval after registration

## 📁 Project Structure Overview

```
viduz-pharmacy/
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/           # Database & environment config
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth, upload, error handling
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── utils/            # Helper functions
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Server entry point
│   ├── .env                  # Environment variables (create this)
│   └── package.json
│
└── client/                    # Frontend (React + Vite)
    ├── src/
    │   ├── components/       # Reusable components
    │   ├── pages/            # Page components
    │   ├── routes/           # Route configuration
    │   ├── services/         # API calls
    │   ├── context/          # State management
    │   ├── App.jsx           # Main app component
    │   └── main.jsx          # Entry point
    ├── index.html
    └── package.json
```

## 🧪 Testing the Application

### 1. Test Customer Flow
1. Register as a customer
2. Browse products
3. Add OTC items to cart
4. Complete checkout

### 2. Test Prescription Flow
1. Login as customer
2. Try to buy a prescription-required product
3. Upload prescription image/PDF
4. Wait for pharmacist approval

### 3. Test Pharmacist Flow
1. Register as pharmacist (provide license number and NIC)
2. Wait for admin approval
3. Login after approval
4. Review pending prescriptions
5. Approve and set prices

### 4. Test Admin Flow
1. Login with admin credentials
2. Approve pending pharmacist registrations
3. Manage products
4. View orders and reports

## 🛠️ Common Issues & Solutions

1. Ensure MongoDB Service is running on your machine.
2. Verify your connection string in `.env` is `mongodb://localhost:27017/Online-Pharmacy-System-1`.
3. If using MongoDB Atlas in the future, check if your IP is whitelisted.

### Issue: Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in server/.env
PORT=5001
```

### Issue: Module Not Found
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd server
npm install
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

#### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)

#### Orders
- `POST /api/orders` - Create order (Customer)
- `GET /api/orders/my-orders` - Get customer orders
- `PATCH /api/orders/:id/status` - Update order status (Pharmacist/Admin)

#### Prescriptions
- `POST /api/prescriptions` - Upload prescription (Customer)
- `GET /api/prescriptions/pending` - Get pending prescriptions (Pharmacist)
- `PATCH /api/prescriptions/:id/review` - Review prescription (Pharmacist)

#### Admin
- `GET /api/admin/pharmacists/pending` - Get pending pharmacist approvals
- `PATCH /api/admin/pharmacists/:id/approval` - Approve/reject pharmacist
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## 🎯 Development Workflow

1. **Backend Development**
   - Make changes to files in `server/src/`
   - Server auto-restarts with nodemon
   - Test API with Postman or browser

2. **Frontend Development**
   - Make changes to files in `client/src/`
   - Vite hot-reloads automatically
   - View changes instantly in browser

3. **Database Changes**
   - Modify models in `server/src/models/`
   - Update seeders if needed
   - Re-run `npm run seed` to reset database

## 🚢 Production Deployment (Future)

### Backend Deployment Options
- **Heroku** - Easy deployment with free tier
- **Railway** - Modern platform with MongoDB support
- **DigitalOcean** - VPS for full control
- **AWS EC2** - Enterprise-grade hosting

### Frontend Deployment Options
- **Vercel** - Optimized for React/Vite
- **Netlify** - Easy continuous deployment
- **GitHub Pages** - Free static hosting

### Database
- **MongoDB Atlas** - Already cloud-hosted
- Upgrade to paid tier for production

## 📝 Next Steps

1. ✅ Complete the frontend components (in progress)
2. ✅ Implement all user dashboards
3. ✅ Add payment integration (future)
4. ✅ Implement delivery rider module (future)
5. ✅ Add email/SMS notifications (future)
6. ✅ Deploy to production

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Review error messages carefully
3. Check MongoDB Atlas connection
4. Verify all environment variables
5. Ensure all dependencies are installed

## 📞 Support

For project-specific questions:
- Check the README.md
- Review the code comments
- Test with the seeded data

---

**Happy Coding! 🚀**

*Viduz Pharmacy Development Team*
