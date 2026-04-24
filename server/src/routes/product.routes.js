import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStockProducts,
} from '../controllers/product.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes - Admin/Pharmacist
router.get('/admin/low-stock', protect, authorize('ADMIN', 'PHARMACIST'), getLowStockProducts);
router.post('/', protect, authorize('ADMIN', 'PHARMACIST'), createProduct);
router.put('/:id', protect, authorize('ADMIN', 'PHARMACIST'), updateProduct);
router.delete('/:id', protect, authorize('ADMIN', 'PHARMACIST'), deleteProduct);
router.patch('/:id/stock', protect, authorize('ADMIN', 'PHARMACIST'), updateStock);

export default router;
