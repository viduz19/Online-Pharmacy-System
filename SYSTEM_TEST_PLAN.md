# Comprehensive System Test Plan - Viduz Pharmacy

This document provides a complete checklist to thoroughly test all workflows and features within the Online Pharmacy System.

---

## 1. Authentication & Registration Testing
- [ ] **Customer Registration:** Register a new customer. Verify they are automatically logged in or redirected to login, and their status is `ACTIVE`.
- [ ] **Pharmacist Registration:** Register a new pharmacist. Ensure their status is `PENDING` and they cannot access the dashboard until approved by an admin.
- [ ] **Admin Login:** Log in using the default admin credentials (`admin@viduzpharmacy.lk`).
- [ ] **Customer Login:** Log in with the newly created customer account.
- [ ] **Logout:** Test the logout functionality across all roles.

---

## 2. Admin Dashboard & Management
- [ ] **Dashboard Stats:** Verify the statistics (Total Users, Revenue, Total Orders) load correctly without errors.
- [ ] **Pharmacist Approval:**
  - Go to "Pending Pharmacists" or the Pharmacist section.
  - Approve the pending pharmacist you registered in step 1.
  - Reject another dummy pharmacist to test the rejection flow.
- [ ] **Category Management:**
  - Create a new category (e.g., "Pain Relief", "Vitamins").
  - Edit an existing category name.
  - Delete a category.
- [ ] **User Management:** Block a customer account and verify they can no longer log in. Unblock them.
- [ ] **Audit Logs:** Verify that actions like registering, logging in, or creating categories are properly recorded in the audit logs.

---

## 3. Pharmacist Dashboard & Inventory
- [ ] **Access Verification:** Log in with the *approved* pharmacist account.
- [ ] **Add Product:** 
  - Navigate to Inventory.
  - Add a new product (ensure the Categories dropdown populates correctly).
  - Add one product that **does not** require a prescription.
  - Add another product that **strictly requires** a prescription.
- [ ] **Update Product:** Edit the stock or price of an existing product.
- [ ] **Dashboard Stats:** Ensure the pharmacist stats (Low Stock items, Pending Prescriptions) are updating accurately.

---

## 4. Customer Shopping & Order Workflow
- [ ] **Product Browsing:** As a customer, navigate to the Products page and verify newly added items are visible.
- [ ] **Standard Cart & Checkout:**
  - Add the non-prescription product to the cart.
  - Attempt to add the prescription-required product to the cart (it should prompt to upload a prescription instead).
  - Proceed to checkout with the non-prescription item.
  - Confirm the order and verify it appears in "Recent Orders" on the dashboard.
- [ ] **Upload Prescription Workflow:**
  - Navigate to "Upload Prescription".
  - Upload an image file (mock prescription) and add some required medicine names.
  - Submit the prescription. Ensure its status is `PENDING_REVIEW`.

---

## 5. Order & Prescription Fulfillment (Pharmacist)
- [ ] **Review Standard Order:** 
  - As a pharmacist, go to Orders.
  - Find the customer's standard order.
  - Update the status from `PENDING` to `PREPARING`, then to `READY_FOR_DELIVERY`.
- [ ] **Review Prescription Request:**
  - Go to "Prescriptions".
  - View the customer's uploaded prescription.
  - **Approve it:** Add pricing for the requested medicines and leave a note. Change status to `APPROVED`.
  - Check the customer dashboard to ensure they now see the priced prescription and a "Pay Now" or "Confirm" button.
- [ ] **Confirm Priced Prescription:**
  - As the customer, confirm the priced prescription to convert it into an official Order.

---

## 6. WhatsApp Communication Integration
- [ ] **Order Inquiry:** As a customer, click the "WhatsApp Support" or "Chat with Pharmacist" button on an Order details page. Verify it opens WhatsApp with the correct pre-filled message and Order ID.
- [ ] **Prescription Inquiry:** Test the WhatsApp button on the Prescription details page.
- [ ] **Help Page:** Test the general WhatsApp support button on the Help page.

---

## 7. Edge Cases & Error Handling
- [ ] **Empty Cart Checkout:** Try to checkout with an empty cart (should not be possible).
- [ ] **Out of Stock:** Try to add a product to the cart that has 0 stock. It should be disabled.
- [ ] **Unauthorized Access:** Try to manually navigate to `/admin/dashboard` while logged in as a Customer (should redirect to home or show unauthorized).
- [ ] **Invalid File Upload:** Try to upload a PDF or text file for the prescription if only images are allowed (or vice versa, check file size limits).
