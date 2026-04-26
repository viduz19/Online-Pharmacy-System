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
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [
            totalUsers,
            totalCustomers,
            totalPharmacists,
            pendingPharmacists,
            totalProducts,
            lowStockProducts,
            totalOrders,
            pendingOrders,
            todayOrdersCount,
            revenueData,
            todayRevenueData,
            monthlyRevenueData,
            ordersByStatus,
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
            Order.countDocuments({ status: { $in: ['PENDING_REVIEW', 'APPROVED', 'AWAITING_PAYMENT'] } }),
            Order.countDocuments({ createdAt: { $gte: startOfDay } }),
            
            // Total Revenue
            Order.aggregate([
                { $match: { paymentStatus: 'PAID', status: { $ne: 'CANCELLED' } } },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]),
            
            // Today Revenue
            Order.aggregate([
                { 
                    $match: { 
                        paymentStatus: 'PAID', 
                        status: { $ne: 'CANCELLED' },
                        createdAt: { $gte: startOfDay }
                    } 
                },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]),
            
            // Monthly Revenue
            Order.aggregate([
                { 
                    $match: { 
                        paymentStatus: 'PAID', 
                        status: { $ne: 'CANCELLED' },
                        createdAt: { $gte: startOfMonth }
                    } 
                },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]),

            // Orders by status
            Order.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
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
                today: todayOrdersCount,
                byStatus: ordersByStatus.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
            },
            revenue: {
                total: revenueData[0]?.total || 0,
                today: todayRevenueData[0]?.total || 0,
                monthly: monthlyRevenueData[0]?.total || 0,
            },
        };

        successResponse(res, 'Dashboard statistics retrieved successfully', stats);
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        errorResponse(res, error.message || 'Error retrieving dashboard statistics', 500);
    }
};

// @desc    Get pharmacist dashboard statistics
// @route   GET /api/pharmacist/stats
// @access  Private/Pharmacist
export const getPharmacistStats = async (req, res) => {
    try {
        const [
            pendingPrescriptions,
            approvedPrescriptions,
            rejectedPrescriptions,
            activeOrders,
            completedOrders,
            lowStockProducts
        ] = await Promise.all([
            Prescription.countDocuments({ status: 'PENDING' }),
            Prescription.countDocuments({ status: 'APPROVED' }),
            Prescription.countDocuments({ status: 'REJECTED' }),
            Order.countDocuments({ status: { $in: ['PAID', 'PREPARING', 'READY_FOR_DELIVERY'] } }),
            Order.countDocuments({ status: 'DELIVERED' }),
            Product.countDocuments({ isActive: true, $expr: { $lte: ['$stock', '$lowStockThreshold'] } })
        ]);

        const stats = {
            prescriptions: {
                pending: pendingPrescriptions,
                approved: approvedPrescriptions,
                rejected: rejectedPrescriptions
            },
            orders: {
                active: activeOrders,
                completed: completedOrders
            },
            inventory: {
                lowStock: lowStockProducts
            }
        };

        successResponse(res, 'Pharmacist statistics retrieved successfully', stats);
    } catch (error) {
        console.error('Get pharmacist stats error:', error);
        errorResponse(res, error.message || 'Error retrieving statistics', 500);
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

// @desc    Get sales reports
// @route   GET /api/admin/reports/sales
// @access  Private/Admin
export const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, period = 'daily' } = req.query;
        
        let start = new Date(startDate || new Date().setDate(new Date().getDate() - 30));
        let end = new Date(endDate || new Date());
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const matchStage = {
            paymentStatus: 'PAID',
            status: { $ne: 'CANCELLED' },
            createdAt: { $gte: start, $lte: end }
        };

        let groupFormat;
        switch (period) {
            case 'monthly':
                groupFormat = { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
                break;
            case 'weekly':
                groupFormat = { week: { $week: '$createdAt' }, year: { $year: '$createdAt' } };
                break;
            case 'daily':
            default:
                groupFormat = { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
                break;
        }

        const salesReport = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: groupFormat,
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                    items: { $sum: { $size: '$items' } }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
        ]);

        const topProducts = await Order.aggregate([
            { $match: matchStage },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    name: { $first: '$items.productName' }, // Note: may need to join with Product if productName isn't in Order
                    quantity: { $sum: '$items.quantity' },
                    revenue: { $sum: '$items.subtotal' }
                }
            },
            { $sort: { quantity: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' }
        ]);

        successResponse(res, 'Sales report retrieved successfully', {
            sales: salesReport,
            topProducts: topProducts.map(p => ({
                id: p._id,
                name: p.productDetails.name,
                brand: p.productDetails.brand,
                quantity: p.quantity,
                revenue: p.revenue
            }))
        });
    } catch (error) {
        console.error('Get sales report error:', error);
        errorResponse(res, error.message || 'Error generating sales report', 500);
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort('name');

        successResponse(res, 'Categories retrieved successfully', categories);
    } catch (error) {
        console.error('Get categories error:', error);
        errorResponse(res, error.message || 'Error retrieving categories', 500);
    }
};

// @desc    Get detailed sales report
// @route   GET /api/admin/reports/sales/detailed
// @access  Private/Admin
export const getDetailedSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const query = { paymentStatus: 'PAID' };
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const sales = await Order.find(query)
            .populate('customer', 'firstName lastName email')
            .sort({ createdAt: -1 });

        const totalRevenue = sales.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = sales.length;

        successResponse(res, 'Sales report retrieved successfully', {
            sales,
            summary: {
                totalRevenue,
                totalOrders,
                avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
            }
        });
    } catch (error) {
        console.error('Get sales report error:', error);
        errorResponse(res, error.message || 'Error generating sales report', 500);
    }
};

// @desc    Get all pharmacists (approved and pending)
// @route   GET /api/admin/pharmacists
// @access  Private/Admin
export const getAllPharmacists = async (req, res) => {
    try {
        const pharmacists = await PharmacistProfile.find()
            .populate('user', 'firstName lastName email phone status')
            .sort({ createdAt: -1 });
        successResponse(res, 'Pharmacists retrieved successfully', pharmacists);
    } catch (error) {
        console.error('Get all pharmacists error:', error);
        errorResponse(res, error.message || 'Error retrieving pharmacists', 500);
    }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'CUSTOMER' })
            .select('-password')
            .sort({ createdAt: -1 });
        successResponse(res, 'Customers retrieved successfully', customers);
    } catch (error) {
        console.error('Get all customers error:', error);
        errorResponse(res, error.message || 'Error retrieving customers', 500);
    }
};
