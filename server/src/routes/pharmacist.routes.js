import express from 'express';
import { getPharmacistStats } from '../controllers/admin.controller.js';
import { 
    getPendingPrescriptions, 
    reviewPrescription,
    getAllPrescriptions 
} from '../controllers/prescription.controller.js';
import { 
    getAllOrders, 
    updateOrderStatus 
} from '../controllers/order.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are pharmacist & admin only
router.use(protect);
router.use(authorize('PHARMACIST', 'ADMIN'));

// Dashboard Stats
router.get('/stats', getPharmacistStats);

// Prescription Management
router.get('/prescriptions/pending', getPendingPrescriptions);
router.get('/prescriptions/all', getAllPrescriptions);
router.patch('/prescriptions/:id/review', reviewPrescription);

// Order Management
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
