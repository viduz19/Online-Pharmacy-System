import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { createAuditLog } from '../utils/auditLog.js';

// @desc    Get all products with filters and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            category,
            prescriptionRequired,
            minPrice,
            maxPrice,
            inStock,
            sort = '-createdAt',
        } = req.query;

        const query = { isActive: true };

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { genericName: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Prescription filter
        if (prescriptionRequired !== undefined) {
            query.prescriptionRequired = prescriptionRequired === 'true';
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Stock filter
        if (inStock === 'true') {
            query.stock = { $gt: 0 };
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        paginatedResponse(
            res,
            'Products retrieved successfully',
            products,
            {
                page: Number(page),
                limit: Number(limit),
                total,
            }
        );
    } catch (error) {
        console.error('Get products error:', error);
        errorResponse(res, error.message || 'Error retrieving products', 500);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug description');

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        successResponse(res, 'Product retrieved successfully', product);
    } catch (error) {
        console.error('Get product error:', error);
        errorResponse(res, error.message || 'Error retrieving product', 500);
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        // Create audit log
        await createAuditLog(req.user.id, 'PRODUCT_CREATED', 'Product', product._id, { name: product.name }, req);

        successResponse(res, 'Product created successfully', product, 201);
    } catch (error) {
        console.error('Create product error:', error);
        errorResponse(res, error.message || 'Error creating product', 500);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        // Create audit log
        await createAuditLog(req.user.id, 'PRODUCT_UPDATED', 'Product', product._id, { name: product.name }, req);

        successResponse(res, 'Product updated successfully', product);
    } catch (error) {
        console.error('Update product error:', error);
        errorResponse(res, error.message || 'Error updating product', 500);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        // Soft delete - set isActive to false
        product.isActive = false;
        await product.save();

        // Create audit log
        await createAuditLog(req.user.id, 'PRODUCT_DELETED', 'Product', product._id, { name: product.name }, req);

        successResponse(res, 'Product deleted successfully');
    } catch (error) {
        console.error('Delete product error:', error);
        errorResponse(res, error.message || 'Error deleting product', 500);
    }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin/Pharmacist
export const updateStock = async (req, res) => {
    try {
        const { stock } = req.body;

        if (stock === undefined || stock < 0) {
            return errorResponse(res, 'Invalid stock value', 400);
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        const oldStock = product.stock;
        product.stock = stock;
        await product.save();

        // Create audit log
        await createAuditLog(
            req.user.id,
            'PRODUCT_UPDATED',
            'Product',
            product._id,
            { name: product.name, stockChange: { from: oldStock, to: stock } },
            req
        );

        successResponse(res, 'Stock updated successfully', product);
    } catch (error) {
        console.error('Update stock error:', error);
        errorResponse(res, error.message || 'Error updating stock', 500);
    }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private/Admin/Pharmacist
export const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isActive: true,
            $expr: { $lte: ['$stock', '$lowStockThreshold'] },
        })
            .populate('category', 'name')
            .sort('stock');

        successResponse(res, 'Low stock products retrieved successfully', products);
    } catch (error) {
        console.error('Get low stock products error:', error);
        errorResponse(res, error.message || 'Error retrieving low stock products', 500);
    }
};
