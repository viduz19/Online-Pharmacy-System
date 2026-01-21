import express from 'express';
import {
    getPendingPharmacists,
    updatePharmacistApproval,
    getAllUsers,
    updateUserStatus,
    getDashboardStats,
    getAuditLogsController,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are admin-only
router.use(protect);
router.use(authorize('ADMIN'));

// Pharmacist management
router.get('/pharmacists/pending', getPendingPharmacists);
router.patch('/pharmacists/:id/approval', updatePharmacistApproval);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Audit logs
router.get('/audit-logs', getAuditLogsController);

// Category management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
