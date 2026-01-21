import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    uploadPaymentProof,
    cancelOrder,
} from '../controllers/order.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadPrescription, handleMulterError } from '../middleware/upload.middleware.js';

const router = express.Router();

// Customer routes
router.post('/', protect, authorize('CUSTOMER'), createOrder);
router.get('/my-orders', protect, authorize('CUSTOMER'), getMyOrders);
router.post('/:id/payment-proof', protect, authorize('CUSTOMER'), uploadPrescription.single('paymentProof'), handleMulterError, uploadPaymentProof);
router.patch('/:id/cancel', protect, authorize('CUSTOMER'), cancelOrder);

// Pharmacist/Admin routes
router.get('/', protect, authorize('PHARMACIST', 'ADMIN'), getAllOrders);
router.patch('/:id/status', protect, authorize('PHARMACIST', 'ADMIN'), updateOrderStatus);

// Shared routes
router.get('/:id', protect, getOrder);

export default router;
