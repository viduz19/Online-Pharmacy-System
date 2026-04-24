import express from 'express';
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route to get categories
router.get('/', getCategories);

// Protected routes (Admin only)
router.post('/', protect, authorize('ADMIN'), createCategory);
router.put('/:id', protect, authorize('ADMIN'), updateCategory);
router.delete('/:id', protect, authorize('ADMIN'), deleteCategory);

export default router;
