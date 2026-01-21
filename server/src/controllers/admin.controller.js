import User from '../models/User.model.js';
import PharmacistProfile from '../models/PharmacistProfile.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import Category from '../models/Category.model.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { createAuditLog, getAuditLogs } from '../utils/auditLog.js';

// @desc    Get pending pharmacist approvals
// @route   GET /api/admin/pharmacists/pending
// @access  Private/Admin
export const getPendingPharmacists = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const skip = (page - 1) * limit;

        const pharmacists = await PharmacistProfile.find({ approvalStatus: 'PENDING' })
            .populate('user', 'firstName lastName email phone createdAt')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await PharmacistProfile.countDocuments({ approvalStatus: 'PENDING' });

        paginatedResponse(res, 'Pending pharmacists retrieved successfully', pharmacists, {
            page: Number(page),
            limit: Number(limit),
            total,
        });
    } catch (error) {
        console.error('Get pending pharmacists error:', error);
        errorResponse(res, error.message || 'Error retrieving pending pharmacists', 500);
    }
};

// @desc    Approve or reject pharmacist
// @route   PATCH /api/admin/pharmacists/:id/approval
// @access  Private/Admin
export const updatePharmacistApproval = async (req, res) => {
    try {
        const { approvalStatus, rejectionReason } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(approvalStatus)) {
            return errorResponse(res, 'Invalid approval status', 400);
        }

        const pharmacistProfile = await PharmacistProfile.findById(req.params.id).populate('user');

        if (!pharmacistProfile) {
            return errorResponse(res, 'Pharmacist profile not found', 404);
        }

        if (pharmacistProfile.approvalStatus !== 'PENDING') {
            return errorResponse(res, 'This pharmacist has already been reviewed', 400);
        }

        pharmacistProfile.approvalStatus = approvalStatus;
        pharmacistProfile.approvedBy = req.user.id;

        if (approvalStatus === 'REJECTED') {
            pharmacistProfile.rejectionReason = rejectionReason;
        }

        await pharmacistProfile.save();

        // Create audit log
        await createAuditLog(
            req.user.id,
            approvalStatus === 'APPROVED' ? 'PHARMACIST_APPROVED' : 'PHARMACIST_REJECTED',
            'PharmacistProfile',
            pharmacistProfile._id,
            {
                pharmacistName: `${pharmacistProfile.user.firstName} ${pharmacistProfile.user.lastName}`,
                licenseNumber: pharmacistProfile.licenseNumber,
            },
            req
        );

        const updatedProfile = await PharmacistProfile.findById(pharmacistProfile._id)
            .populate('user', 'firstName lastName email phone status')
            .populate('approvedBy', 'firstName lastName');

        successResponse(
            res,
            `Pharmacist ${approvalStatus.toLowerCase()} successfully`,
            updatedProfile
        );
    } catch (error) {
        console.error('Update pharmacist approval error:', error);
        errorResponse(res, error.message || 'Error updating pharmacist approval', 500);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, status, search } = req.query;

        const query = {};

        if (role) query.role = role;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await User.countDocuments(query);

        paginatedResponse(res, 'Users retrieved successfully', users, {
            page: Number(page),
            limit: Number(limit),
            total,
        });
    } catch (error) {
        console.error('Get all users error:', error);
        errorResponse(res, error.message || 'Error retrieving users', 500);
    }
};

// @desc    Update user status (Block/Activate)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['ACTIVE', 'BLOCKED'].includes(status)) {
            return errorResponse(res, 'Invalid status', 400);
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        if (user.role === 'ADMIN') {
            return errorResponse(res, 'Cannot modify admin user status', 403);
        }

        user.status = status;
        await user.save();

        // Create audit log
        await createAuditLog(
            req.user.id,
            status === 'BLOCKED' ? 'USER_BLOCKED' : 'USER_ACTIVATED',
            'User',
            user._id,
            { userName: `${user.firstName} ${user.lastName}`, email: user.email },
            req
        );

        successResponse(res, `User ${status.toLowerCase()} successfully`, user);
    } catch (error) {
        console.error('Update user status error:', error);
        errorResponse(res, error.message || 'Error updating user status', 500);
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalCustomers,
            totalPharmacists,
            pendingPharmacists,
            totalProducts,
            lowStockProducts,
            totalOrders,
            pendingOrders,
            todayOrders,
            totalRevenue,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'CUSTOMER' }),
            User.countDocuments({ role: 'PHARMACIST', status: 'ACTIVE' }),
            PharmacistProfile.countDocuments({ approvalStatus: 'PENDING' }),
            Product.countDocuments({ isActive: true }),
            Product.countDocuments({
                isActive: true,
                $expr: { $lte: ['$stock', '$lowStockThreshold'] },
            }),
            Order.countDocuments(),
            Order.countDocuments({ status: 'PENDING_REVIEW' }),
            Order.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            }),
            Order.aggregate([
                { $match: { paymentStatus: 'PAID' } },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]),
        ]);

        const stats = {
            users: {
                total: totalUsers,
                customers: totalCustomers,
                pharmacists: totalPharmacists,
                pendingPharmacists,
            },
            products: {
                total: totalProducts,
                lowStock: lowStockProducts,
            },
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                today: todayOrders,
            },
            revenue: {
                total: totalRevenue[0]?.total || 0,
            },
        };

        successResponse(res, 'Dashboard statistics retrieved successfully', stats);
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        errorResponse(res, error.message || 'Error retrieving dashboard statistics', 500);
    }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
export const getAuditLogsController = async (req, res) => {
    try {
        const { page = 1, limit = 50, user, action, targetModel } = req.query;

        const filters = {};
        if (user) filters.user = user;
        if (action) filters.action = action;
        if (targetModel) filters.targetModel = targetModel;

        const result = await getAuditLogs(filters, Number(page), Number(limit));

        paginatedResponse(res, 'Audit logs retrieved successfully', result.logs, result.pagination);
    } catch (error) {
        console.error('Get audit logs error:', error);
        errorResponse(res, error.message || 'Error retrieving audit logs', 500);
    }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);

        // Create audit log
        await createAuditLog(req.user.id, 'CATEGORY_CREATED', 'Category', category._id, { name: category.name }, req);

        successResponse(res, 'Category created successfully', category, 201);
    } catch (error) {
        console.error('Create category error:', error);
        errorResponse(res, error.message || 'Error creating category', 500);
    }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        // Create audit log
        await createAuditLog(req.user.id, 'CATEGORY_UPDATED', 'Category', category._id, { name: category.name }, req);

        successResponse(res, 'Category updated successfully', category);
    } catch (error) {
        console.error('Update category error:', error);
        errorResponse(res, error.message || 'Error updating category', 500);
    }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        // Check if category has products
        const productsCount = await Product.countDocuments({ category: category._id });

        if (productsCount > 0) {
            return errorResponse(res, 'Cannot delete category with existing products', 400);
        }

        await category.deleteOne();

        // Create audit log
        await createAuditLog(req.user.id, 'CATEGORY_DELETED', 'Category', category._id, { name: category.name }, req);

        successResponse(res, 'Category deleted successfully');
    } catch (error) {
        console.error('Delete category error:', error);
        errorResponse(res, error.message || 'Error deleting category', 500);
    }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort('name');

        successResponse(res, 'Categories retrieved successfully', categories);
    } catch (error) {
        console.error('Get categories error:', error);
        errorResponse(res, error.message || 'Error retrieving categories', 500);
    }
};
