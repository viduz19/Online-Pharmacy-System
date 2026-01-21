import express from 'express';
import {
    uploadPrescription,
    getMyPrescriptions,
    getPendingPrescriptions,
    getPrescription,
    reviewPrescription,
    getAllPrescriptions,
} from '../controllers/prescription.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadPrescription as upload, handleMulterError } from '../middleware/upload.middleware.js';

const router = express.Router();

// Customer routes
router.post('/', protect, authorize('CUSTOMER'), upload.array('prescriptions', 5), handleMulterError, uploadPrescription);
router.get('/my-prescriptions', protect, authorize('CUSTOMER'), getMyPrescriptions);

// Pharmacist routes
router.get('/pending', protect, authorize('PHARMACIST'), getPendingPrescriptions);
router.patch('/:id/review', protect, authorize('PHARMACIST'), reviewPrescription);

// Admin routes
router.get('/', protect, authorize('ADMIN'), getAllPrescriptions);

// Shared routes
router.get('/:id', protect, getPrescription);

export default router;
