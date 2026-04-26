# Online Pharmacy System - Workflow Example

## Overview
This document outlines a complete, end-to-end example of how the Online Pharmacy System operates. It covers the journey of an order from the moment a customer places it, through the pharmacist's review, admin monitoring, and the manual communication steps required for payment and final approval.

---

## Step 1: Customer Places an Order
**Actor:** Customer
- The customer logs into their account and accesses the Customer Dashboard.
- They browse the available catalog to add standard medicines to their cart, OR they upload a doctor's prescription for specific medications.
- Upon submitting the order or prescription request, the system records it and assigns it an initial status of **PENDING** (or `PENDING_REVIEW`).

## Step 2: Pharmacist Review and Processing
**Actor:** Pharmacist
- A registered Pharmacist logs into the Pharmacist Dashboard.
- They navigate to the "Pending Prescriptions" or "Orders" section and open the newly submitted request.
- **Verification:** The pharmacist carefully reviews the uploaded prescription image against the requested medicines to ensure accuracy and safety. They also check the current inventory stock.
- **Action:**
  - **Approve:** If valid, the pharmacist prices the medicines, adds any necessary notes, and marks the request as **APPROVED**.
  - **Reject:** If the prescription is invalid, unclear, or medicines are out of stock, they can mark it as **REJECTED** and provide a reason.

## Step 3: Admin Monitoring
**Actor:** Admin
- The Administrator logs into the Admin Dashboard.
- The admin has full oversight of the platform and can view all orders, prescriptions, and user activities.
- They can see that the customer placed an order and that a specific pharmacist reviewed and approved it. 
- This helps the admin monitor overall sales, track performance, and ensure smooth operational flow.

## Step 4: Payment Arrangement and Final Approval (WhatsApp Workflow)
**Actors:** Customer & Pharmacist
- **The Context:** Because the system currently does not have an automated online payment gateway (like Stripe, PayPal, etc.) integrated, the final payment and delivery confirmation must be handled externally.
- **The Process:**
  1. Once the pharmacist approves the order, the customer sees the updated status (and the final price) on their dashboard.
  2. The customer clicks the **"WhatsApp Support"** or **"Chat with Pharmacist"** button available on the Order Details or Prescription Details page.
  3. This opens a direct WhatsApp chat with the pharmacy's official number (`+94774708984`). The system automatically pre-fills a message containing their **Order ID** and **Status**.
  4. The customer and pharmacist communicate via WhatsApp to finalize payment details (e.g., agreeing on Cash on Delivery or a direct Bank Transfer).
  5. Once the manual payment arrangement is confirmed, the pharmacist updates the final status of the order in the system to **PAID**, **PREPARING**, and eventually **DELIVERED**.
