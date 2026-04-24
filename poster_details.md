# Academic Project Poster: Online Pharmacy Management System

## 1. Student Information & Award
*   **Student Name:** Vidusha Puswalkataiya
*   **Award Aiming For:** BSc (Hons) Computing

## 2. Project Title
**Viduz Pharmacy: An Integrated Online Pharmacy Management System for Enhanced Medicine Accessibility and Inventory Control**

## 3. Introduction & Literature Review Summary
**Subject Area:** E-Health & Pharmaceutical Management Systems.

**Background:**
Traditionally, pharmaceutical services in local contexts have been slow to digitalize, relying on physical visits and manual record-keeping. This project introduces a centralized platform to bridge the gap between digital convenience and medical safety.

**Literature Review Summary:**
Initial research and literature review revealed several key insights:
*   **Global Trends:** Studies show that E-Pharmacy markets are growing at a CAGR of 15%+, driven by the need for home-delivery and digital record-keeping.
*   **Security Concerns:** Literature highlights that the biggest barrier to online pharmacies is the "verification of prescriptions." Most existing small-scale systems fail to provide a robust workflow for pharmacist review.
*   **Regulatory Standards:** Research into SLMC (Sri Lanka Medical Council) standards indicates that strict verification of patient identity and physician signatures is mandatory for Rx drugs.
*   **UI/UX Importance:** Modern studies emphasize that healthcare applications must have high accessibility and "trust-inspiring" designs to be successful among diverse age groups.

## 4. Rationale for Choosing This Project
*   **Identifying the Gap:** The COVID-19 pandemic exposed the fragility of manual medicine procurement. I chose this project to provide a resilient, digital-first solution.
*   **Technical Challenge:** Building a multi-tenant system with three distinct user roles (Admin, Pharmacist, Customer) presents a significant architectural challenge in full-stack development.
*   **Social Impact:** Enhancing medicine accessibility for elderly and remote populations provides a direct social benefit.

## 5. Aims and Objectives
**Primary Aim:** To design and implement a secure, multi-role pharmaceutical platform that automates the prescription-to-delivery lifecycle.

**Core Objectives:**
*   **Objective 1:** Develop a secure authentication system with role-based access control.
*   **Objective 2:** Implement a real-time inventory management system with automated low-stock notifications.
*   **Objective 3:** Create a robust prescription upload and pharmacist-led verification workflow.
*   **Objective 4:** Ensure 100% responsiveness across mobile and desktop platforms using modern CSS.

## 6. Brief Report: Work Done & Findings So Far
**Progress Update:**
*   **Full-Stack Architecture:** Successfully implemented a decoupled MERN architecture with a RESTful API.
*   **Inventory Logic:** Developed a CRUD-based inventory system that handles medical specifications (dosage, strength, brand).
*   **Workflow Implementation:** Completed the "Customer Upload -> Pharmacist Review -> Order Confirmation" cycle.
*   **UI Branding:** Applied a premium design system (font-black, tracking-tight) that improves user engagement and trust.

**Key Findings:**
*   **System Synergy:** Found that integrating inventory alerts directly into the dashboard significantly reduces the response time for pharmacists.
*   **Performance:** MongoDB's flexible schema was found to be superior for handling varying medication details compared to traditional SQL databases.

## 7. Evaluation of Achievements
*   **Functional Completion:** 90% of core functional requirements (Ordering, CRUD, Auth) are fully operational.
*   **UI Excellence:** The interface exceeds standard project requirements, achieving a professional, industry-grade aesthetic.
*   **Security:** Successfully implemented JWT and bcrypt, ensuring that user data and medical records are protected from unauthorized access.
*   **Defensive Programming:** Integrated robust error handling to prevent system crashes during API failures.

## 8. Next Steps: Where I Am Going Next
*   **Payment Integration:** My next focus is implementing a secure payment gateway (e.g., Stripe or PayHere) to complete the checkout experience.
*   **Communication Enhancement:** Integrating a real-time notification system (WebSockets) for instant order updates.
*   **Rider Management:** Developing the fourth role in the system—the Delivery Rider—to track the physical logistics of the medicine.
*   **Automated Verification:** Researching AI-based OCR to assist pharmacists in reading handwritten prescriptions more accurately.
