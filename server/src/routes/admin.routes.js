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
    getSalesReport,
    getAllPharmacists,
    getAllCustomers,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are admin-only
router.use(protect);
router.use(authorize('ADMIN'));

// Pharmacist management
router.get('/pharmacists/pending', getPendingPharmacists);
router.get('/pharmacists', getAllPharmacists);
router.patch('/pharmacists/:id/approval', updatePharmacistApproval);

// User management
router.get('/users', getAllUsers);
router.get('/customers', getAllCustomers);
router.patch('/users/:id/status', updateUserStatus);

// Dashboard & Reports
router.get('/dashboard/stats', getDashboardStats);
router.get('/reports/sales', getSalesReport);

// Audit logs
router.get('/audit-logs', getAuditLogsController);

export default router;
