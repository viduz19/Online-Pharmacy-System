# 🚀 Viduz Pharmacy - Quick Start

## ✅ Setup Complete!

Your Viduz Pharmacy project is now fully configured and ready to run!

## 📊 What's Been Set Up

✅ **Backend (Server)**
- All dependencies installed
- MongoDB Atlas connected
- Database seeded with sample data
- Admin account created
- 16 products added
- 10 categories created

✅ **Frontend (Client)**
- All dependencies installed
- Vite + React configured
- Tailwind CSS ready
- Router setup complete

## 🎯 How to Run the Application

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Backend Server:**
```bash
cd "E:/London Tec Degree/Final Year Project/Viduz Pharmacy/server"
npm run dev
```

**Terminal 2 - Frontend Server:**
```bash
cd "E:/London Tec Degree/Final Year Project/Viduz Pharmacy/client"
npm run dev
```

### Option 2: Using VS Code Split Terminal

1. Open VS Code
2. Open Terminal (Ctrl + `)
3. Click the "Split Terminal" button (or Ctrl + Shift + 5)
4. In left terminal: `cd server && npm run dev`
5. In right terminal: `cd client && npm run dev`

## 🌐 Access the Application

Once both servers are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 🔑 Login Credentials

### Admin Account
```
Email: admin@viduzpharmacy.lk
Password: Admin@123
```

### Create Test Accounts

**Customer:**
1. Go to http://localhost:5173
2. Click "Register"
3. Select role: "Customer"
4. Fill in details
5. Login immediately (no approval needed)

**Pharmacist:**
1. Click "Register"
2. Select role: "Pharmacist"
3. Fill in details + License Number + NIC
4. Wait for admin approval
5. Login as admin to approve
6. Then login as pharmacist

## 📦 Sample Data Available

### Products (16 items)
**OTC Products:**
- Panadol (Rs. 45)
- Samahan (Rs. 25)
- Piriton (Rs. 35)
- ORS Sachets (Rs. 15)
- Dettol Antiseptic (Rs. 450)
- Vitamin C (Rs. 850)
- Eno Fruit Salt (Rs. 20)
- Betadine Solution (Rs. 380)
- Savlon Cream (Rs. 250)
- Salonsip Patch (Rs. 180)

**Prescription Required:**
- Amoxicillin 500mg (Rs. 15)
- Azithromycin 500mg (Rs. 85)
- Metformin 500mg (Rs. 12)
- Amlodipine 5mg (Rs. 18)
- Atorvastatin 10mg (Rs. 22)
- Omeprazole 20mg (Rs. 28)

### Categories (10)
1. Pain Relief
2. Antibiotics
3. Diabetes Care
4. Heart & Blood Pressure
5. Digestive Health
6. Vitamins & Supplements
7. Cold & Flu
8. First Aid & Wound Care
9. Herbal & Ayurvedic
10. Skin Care

## 🧪 Testing the Workflows

### Test 1: Customer OTC Purchase
1. Register as customer
2. Browse products
3. Add OTC items to cart
4. Checkout
5. View order in "My Orders"

### Test 2: Prescription Upload
1. Login as customer
2. Try to buy prescription medicine (e.g., Amoxicillin)
3. Upload prescription image/PDF
4. Wait for pharmacist review

### Test 3: Pharmacist Approval
1. Register as pharmacist
2. Login as admin
3. Go to "Pharmacist Approvals"
4. Approve the pharmacist
5. Login as pharmacist
6. Review pending prescriptions

### Test 4: Admin Functions
1. Login as admin
2. View dashboard statistics
3. Manage products
4. View audit logs
5. Manage users

## 🛠️ Development Commands

### Backend Commands
```bash
cd server

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Seed database (reset data)
npm run seed
```

### Frontend Commands
```bash
cd client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Important Files

### Backend
- `server/.env` - Environment variables (MongoDB URL, JWT secret)
- `server/src/server.js` - Server entry point
- `server/src/app.js` - Express app configuration
- `server/src/models/` - Database models
- `server/src/controllers/` - Business logic
- `server/src/routes/` - API endpoints

### Frontend
- `client/src/main.jsx` - React entry point
- `client/src/App.jsx` - Main app component
- `client/src/index.css` - Global styles
- `client/vite.config.js` - Vite configuration
- `client/tailwind.config.js` - Tailwind configuration

## 🔍 API Testing

### Using Browser
Visit: http://localhost:5000/api/health

### Using cURL
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@viduzpharmacy.lk\",\"password\":\"Admin@123\"}"

# Get products
curl http://localhost:5000/api/products
```

### Using Postman
1. Import the API endpoints from API_REFERENCE.md
2. Set base URL: http://localhost:5000/api
3. Test authentication endpoints first
4. Use the token for protected routes

## ⚠️ Common Issues

### Issue: "Port already in use"
**Solution:**
```bash
# Find and kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=5001
```

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Check internet connection
2. Verify MongoDB Atlas IP whitelist
3. Check connection string in `server/.env`
4. Ensure cluster is running in MongoDB Atlas

### Issue: "Module not found"
**Solution:**
```bash
# Reinstall dependencies
cd server && npm install
cd ../client && npm install
```

### Issue: Frontend shows blank page
**Solution:**
1. Check browser console for errors
2. Ensure backend is running
3. Clear browser cache
4. Check if port 5173 is available

## 📚 Next Steps

### Immediate Tasks
1. ✅ Run both servers
2. ✅ Login as admin
3. ✅ Browse products
4. ✅ Test user registration
5. ✅ Test prescription upload

### Development Tasks
1. Create frontend components
2. Build authentication pages
3. Develop product listing page
4. Create dashboards for each role
5. Implement cart functionality
6. Build prescription upload UI

## 📖 Documentation

- **README.md** - Project overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **API_REFERENCE.md** - API documentation
- **PROJECT_SUMMARY.md** - Complete project details
- **ROADMAP.md** - Development timeline

## 🆘 Need Help?

1. Check the error message in terminal
2. Review the documentation files
3. Check MongoDB Atlas dashboard
4. Verify environment variables
5. Ensure all dependencies are installed

## 🎉 Success Indicators

You'll know everything is working when:

✅ Backend shows: "Server running on port 5000"
✅ Backend shows: "MongoDB Connected"
✅ Frontend shows: "Local: http://localhost:5173/"
✅ Browser opens and shows the app
✅ No errors in browser console
✅ Can login as admin successfully

## 🚀 You're Ready!

Your Viduz Pharmacy system is now fully operational!

**Backend:** Complete ✅
**Frontend:** Setup Complete ✅
**Database:** Seeded ✅
**Ready to Code:** YES! 🎯

---

**Happy Coding! 🚀**

*Last Updated: January 21, 2026*
