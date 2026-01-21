# 🧪 Viduz Pharmacy - Test Data & Sample Forms

## 📋 Sample Data for Registration Testing

### **1. Customer Registration Sample Data**

```
Role: Customer

Personal Information:
- First Name: Kasun
- Last Name: Perera
- Email: kasun.perera@gmail.com
- Phone: +94771234567

Address:
- Street Address: 123 Galle Road
- City: Colombo
- Province: Western
- Postal Code: 00300

Security:
- Password: Customer@123
- Confirm Password: Customer@123
```

---

### **2. Pharmacist Registration Sample Data**

```
Role: Pharmacist

Personal Information:
- First Name: Nimal
- Last Name: Silva
- Email: nimal.silva@pharmacy.lk
- Phone: +94712345678

Address:
- Street Address: 456 Kandy Road
- City: Kandy
- Province: Central
- Postal Code: 20000

Professional Information:
- SLMC License Number: SLMC12345
- NIC Number: 199012345678
- Qualifications: B.Pharm, M.Pharm
- Years of Experience: 5
- Pharmacy Branch: Kandy Main Branch
- Specialization: Clinical Pharmacy

Security:
- Password: Pharmacist@123
- Confirm Password: Pharmacist@123
```

---

### **3. Another Pharmacist Sample**

```
Role: Pharmacist

Personal Information:
- First Name: Saman
- Last Name: Fernando
- Email: saman.fernando@pharmacy.lk
- Phone: +94773456789

Address:
- Street Address: 789 Negombo Road
- City: Negombo
- Province: Western
- Postal Code: 11500

Professional Information:
- SLMC License Number: SLMC67890
- NIC Number: 198567891234
- Qualifications: B.Pharm
- Years of Experience: 8
- Pharmacy Branch: Negombo Branch
- Specialization: Community Pharmacy

Security:
- Password: Pharmacist@123
- Confirm Password: Pharmacist@123
```

---

## 🔑 Pre-Created Login Credentials

### **Admin Account**
```
Email: admin@viduzpharmacy.lk
Password: Admin@123
Role: ADMIN
Status: ACTIVE
```

---

## 📝 Sample Prescription Upload Data

### **Prescription Upload Form**

```
Requested Medicines:
1. Medicine Name: Amoxicillin 500mg
   Quantity: 10
   Notes: Take after meals

2. Medicine Name: Azithromycin 500mg
   Quantity: 6
   Notes: 3-day course

Delivery Address:
- Street Address: 123 Galle Road
- City: Colombo
- Province: Western
- Postal Code: 00300
- Contact Phone: +94771234567

Customer Notes:
Need urgently. Please deliver in the evening after 5 PM.

Files to Upload:
- Upload a prescription image (JPEG/PNG) or PDF
- Maximum 5 files, 5MB each
```

---

## 🛒 Sample OTC Order Data

### **Products to Add to Cart**

```
OTC Products (No Prescription Required):
1. Panadol (Paracetamol 500mg) - Rs. 45
2. Samahan (Herbal Tea) - Rs. 25
3. Piriton (Chlorpheniramine 4mg) - Rs. 35
4. ORS Sachets - Rs. 15
5. Vitamin C Tablets - Rs. 850

Delivery Address:
- Street: 123 Galle Road
- City: Colombo
- Province: Western
- Postal Code: 00300
- Phone: +94771234567

Payment Method: COD (Cash on Delivery)
```

---

## 🧪 Testing Workflows

### **Workflow 1: Customer Registration & OTC Purchase**

1. **Register as Customer**
   - Use Customer Sample Data above
   - Click "Create Account"
   - ✅ Should redirect to Customer Dashboard

2. **Browse Products**
   - Go to Products page
   - Search for "Panadol"
   - View product details

3. **Place OTC Order**
   - Add OTC products to cart
   - Proceed to checkout
   - Enter delivery address
   - Confirm order

---

### **Workflow 2: Pharmacist Registration & Approval**

1. **Register as Pharmacist**
   - Use Pharmacist Sample Data above
   - Fill in all professional fields
   - Click "Create Account"
   - ⏳ Account status: PENDING

2. **Admin Approves Pharmacist**
   - Login as Admin
   - Go to Pharmacist Approvals
   - Approve the pharmacist
   - ✅ Pharmacist status: ACTIVE

3. **Pharmacist Login**
   - Logout from Admin
   - Login with pharmacist credentials
   - ✅ Should redirect to Pharmacist Dashboard

---

### **Workflow 3: Prescription Upload & Review**

1. **Customer Uploads Prescription**
   - Login as Customer
   - Go to "Upload Prescription"
   - Upload prescription files
   - List requested medicines
   - Submit

2. **Pharmacist Reviews Prescription**
   - Login as Pharmacist
   - Go to "Pending Prescriptions"
   - Review uploaded prescription
   - Approve and set price
   - Send confirmation to customer

3. **Customer Confirms & Pays**
   - Customer receives price notification
   - Confirms order
   - Uploads payment proof
   - Order moves to "Preparing"

---

## 📊 Sample Products in Database

### **OTC Products (No Prescription)**
```
1. Panadol - Rs. 45 (500 in stock)
2. Samahan - Rs. 25 (1000 in stock)
3. Piriton - Rs. 35 (300 in stock)
4. ORS Sachets - Rs. 15 (800 in stock)
5. Dettol Antiseptic - Rs. 450 (200 in stock)
6. Vitamin C - Rs. 850 (150 in stock)
7. Eno Fruit Salt - Rs. 20 (600 in stock)
8. Betadine Solution - Rs. 380 (180 in stock)
9. Savlon Cream - Rs. 250 (220 in stock)
10. Salonsip Patch - Rs. 180 (150 in stock)
```

### **Prescription Required**
```
1. Amoxicillin 500mg - Rs. 15 (400 in stock)
2. Azithromycin 500mg - Rs. 85 (250 in stock)
3. Metformin 500mg - Rs. 12 (600 in stock)
4. Amlodipine 5mg - Rs. 18 (500 in stock)
5. Atorvastatin 10mg - Rs. 22 (450 in stock)
6. Omeprazole 20mg - Rs. 28 (350 in stock)
```

---

## 🎯 Quick Test Checklist

### **Registration Tests**
- [ ] Register as Customer
- [ ] Register as Pharmacist
- [ ] Verify email validation
- [ ] Verify password matching
- [ ] Verify required fields

### **Login Tests**
- [ ] Login as Admin
- [ ] Login as Customer
- [ ] Login as Pharmacist (after approval)
- [ ] Verify role-based redirects

### **Product Tests**
- [ ] Browse all products
- [ ] Search for products
- [ ] Filter by category
- [ ] View product details

### **Prescription Tests**
- [ ] Upload prescription files
- [ ] Add requested medicines
- [ ] Submit prescription
- [ ] Pharmacist review
- [ ] Price confirmation

### **Order Tests**
- [ ] Add OTC products to cart
- [ ] Checkout process
- [ ] Order tracking
- [ ] Status updates

---

## 🔧 Troubleshooting

### **If Registration Fails:**
- Check all required fields are filled
- Ensure passwords match
- Verify email format
- Check phone number format (+94XXXXXXXXX)

### **If Login Fails:**
- Verify email and password
- Check if pharmacist is approved (if registering as pharmacist)
- Clear browser cache
- Check backend is running

### **If File Upload Fails:**
- Check file size (max 5MB)
- Verify file type (JPEG, PNG, PDF only)
- Maximum 5 files allowed
- Check backend is running

---

## 📞 Support

**Backend API:** http://localhost:5000/api  
**Frontend:** http://localhost:5173  
**Health Check:** http://localhost:5000/api/health

---

**Use this data to test all features of your Viduz Pharmacy system!** 🚀

*Last Updated: January 21, 2026*
