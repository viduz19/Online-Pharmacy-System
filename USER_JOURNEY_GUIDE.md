# 🧪 Viduz Pharmacy - Complete User Journey Testing Guide

## 🎯 Overview
This guide provides a comprehensive, step-by-step walkthrough for testing the Viduz Pharmacy system. It covers the complete lifecycle of a user, from registration to order completion, for all integrated roles.

---

## 📋 Prerequisites
- **Backend Server:** `cd server && npm run dev` (Port 5000)
- **Frontend Server:** `cd client && npm run dev` (Port 5173)
- **Database:** Ensure MongoDB Atlas is connected.

---

## 👤 Customer – User Journeys (Step-by-Step)

### **1) Register as Customer**
1. Open Viduz Pharmacy website (http://localhost:5173)
2. Click **Register** on the navigation bar.
3. Select role **Customer**.
4. Enter: Name, Email/Phone, Password, and Address.
5. Click **Create Account**.
6. **✅ Expected:** System creates account and automatically redirects to the **Customer Dashboard**.

### **2) Login**
1. Click **Login** on the navigation bar.
2. Enter email/phone + password.
3. Click **Sign In**.
4. **✅ Expected:** System opens the **Customer Dashboard**.

### **3) Browse Products**
1. From the dashboard, click **Browse Products**.
2. View various categories (e.g., Pain Relief, Vitamins, Cough/Cold).
3. Click a product to see details (price, stock, OTC/Prescription status).
4. **✅ Expected:** Product list is rendered from the real database.

### **4) Search for a Product**
1. Go to the **Products** page.
2. Type in the **Search bar** (e.g., “Panadol”, “Samahan”).
3. System shows matching products instantly.
4. Optionally use filters (OTC only, in-stock, price range).
5. **✅ Expected:** Real-time filtering of product data.

### **5) Buy OTC Product (No Prescription)**
1. Open an **OTC product** card.
2. Click **Add to Cart** (Currently simulated with a success message).
3. Confirm quantity and address.
4. Select payment method (Mock Pay / COD).
5. Click **Place Order**.
6. **✅ Expected:** System shows success message and creates an order with status **Order Placed / Preparing**.

### **6) Try to Buy Prescription Product (System Blocks)**
1. Open a **Prescription Required** product (e.g., Amoxicillin).
2. Click **Add to Cart / Buy**.
3. **✅ Expected:** System shows message: *“This item requires a verified doctor prescription. Upload prescription to continue.”*
4. System displays the **Upload Prescription** button.

### **7) Upload Prescription (Image/PDF) and Submit Request**
1. Click **Upload Prescription**.
2. Choose a file (clear Image or PDF).
3. Optionally add notes (e.g., “Need 10 tablets”).
4. Click **Submit**.
5. **✅ Expected:** System creates request with status **Pending Review**. Seen in **My Prescription Requests**.

### **8) Receive Pharmacist Price Message**
1. Customer waits for pharmacist review (See Pharmacist Journey below).
2. Customer opens **Messages/Notifications** or checks dashboard.
3. Seeks pharmacist message with: medicine list + total price.
4. Click **View Order Summary**.
5. **✅ Expected:** Status shows **Awaiting Payment**.

### **9) Make Payment (Project Version)**
1. Click **Pay Now** (Simulated mock payment).
2. System confirms payment success.
3. **✅ Expected:** Status updates to **Paid**.

### **10) Track Order Status**
1. Open **My Orders** section.
2. Select a specific order.
3. View the status timeline:
   *   *Pending Review → Approved → Awaiting Payment → Paid → Preparing → Ready for Delivery*
4. **✅ Expected:** Final notification: *“Ready for delivery (rider module future)”*.

---

## 💊 Pharmacist – User Journeys

### **1) Registration & Approval**
1. Register with professional details (SLMC License, NIC).
2. Wait for Admin approval.
3. Login after status becomes **ACTIVE**.

### **2) Reviewing Prescriptions**
1. Open **Pending Reviews**.
2. View customer's uploaded files.
3. Set prices for requested medicines.
4. Calculate total with delivery fee.
5. Click **Submit Approval**.

---

## 👨‍💼 Admin – User Journeys

### **1) Management**
1. Approve/Reject pending Pharmacists.
2. Manage Product inventory (Add/Edit medicines).
3. Monitor all system orders and audit logs.

---

## 🎯 Success Checklist
- [ ] Customer registers and logs in smoothly.
- [ ] Products are fetched from real backend.
- [ ] Prescription upload workflow is functional.
- [ ] Pharmacist can set prices and approve.
- [ ] Orders transition through all statuses correctly.

**The Viduz Pharmacy system is now ready for end-to-end user journey testing!** 🚀
