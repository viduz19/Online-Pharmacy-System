import Prescription from '../models/Prescription.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import Message from '../models/Message.model.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { createAuditLog } from '../utils/auditLog.js';

// @desc    Upload prescription and create request
// @route   POST /api/prescriptions
// @access  Private/Customer
export const uploadPrescription = async (req, res) => {
    try {
        const { requestedMedicines, customerNotes, deliveryAddress } = req.body;

        if (!req.files || req.files.length === 0) {
            return errorResponse(res, 'Please upload at least one prescription file', 400);
        }

        // Process uploaded files
        const files = req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
        }));

        // Create prescription record
        const prescription = await Prescription.create({
            customer: req.user.id,
            files,
            requestedMedicines: JSON.parse(requestedMedicines || '[]'),
            customerNotes,
            status: 'PENDING',
        });

        // Create order with prescription
        const order = await Order.create({
            customer: req.user.id,
            prescription: prescription._id,
            items: [], // Will be filled by pharmacist
            deliveryAddress: JSON.parse(deliveryAddress),
            status: 'PENDING_REVIEW',
            paymentStatus: 'PENDING',
            subtotal: 0,
            total: 0,
        });

        // Link order to prescription
        prescription.order = order._id;
        await prescription.save();

        // Create audit log
        await createAuditLog(
            req.user.id,
            'ORDER_CREATED',
            'Order',
            order._id,
            { orderNumber: order.orderNumber, type: 'prescription' },
            req
        );

        const populatedPrescription = await Prescription.findById(prescription._id)
            .populate('customer', 'firstName lastName email phone')
            .populate('order');

        successResponse(
            res,
            'Prescription uploaded successfully. A pharmacist will review your request shortly.',
            populatedPrescription,
            201
        );
    } catch (error) {
        console.error('Upload prescription error:', error);
        errorResponse(res, error.message || 'Error uploading prescription', 500);
    }
};

// @desc    Get customer prescriptions
// @route   GET /api/prescriptions/my-prescriptions
// @access  Private/Customer
export const getMyPrescriptions = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = { customer: req.user.id };

        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const prescriptions = await Prescription.find(query)
            .populate('order')
            .populate('reviewedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Prescription.countDocuments(query);

        paginatedResponse(res, 'Prescriptions retrieved successfully', prescriptions, {
            page: Number(page),
            limit: Number(limit),
            total,
        });
    } catch (error) {
        console.error('Get my prescriptions error:', error);
        errorResponse(res, error.message || 'Error retrieving prescriptions', 500);
    }
};

// @desc    Get all pending prescriptions (Pharmacist)
// @route   GET /api/prescriptions/pending
// @access  Private/Pharmacist
export const getPendingPrescriptions = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const skip = (page - 1) * limit;

        const prescriptions = await Prescription.find({ status: 'PENDING' })
            .populate('customer', 'firstName lastName email phone address')
            .populate('order')
            .sort({ createdAt: 1 }) // Oldest first
            .skip(skip)
            .limit(Number(limit));

        const total = await Prescription.countDocuments({ status: 'PENDING' });

        paginatedResponse(res, 'Pending prescriptions retrieved successfully', prescriptions, {
            page: Number(page),
            limit: Number(limit),
            total,
        });
    } catch (error) {
        console.error('Get pending prescriptions error:', error);
        errorResponse(res, error.message || 'Error retrieving pending prescriptions', 500);
    }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
export const getPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('customer', 'firstName lastName email phone address')
            .populate('order')
            .populate('reviewedBy', 'firstName lastName');

        if (!prescription) {
            return errorResponse(res, 'Prescription not found', 404);
        }

        // Check authorization
        if (
            req.user.role === 'CUSTOMER' &&
            prescription.customer._id.toString() !== req.user.id
        ) {
            return errorResponse(res, 'Not authorized to access this prescription', 403);
        }

        successResponse(res, 'Prescription retrieved successfully', prescription);
    } catch (error) {
        console.error('Get prescription error:', error);
        errorResponse(res, error.message || 'Error retrieving prescription', 500);
    }
};

// @desc    Review prescription (Approve/Reject)
// @route   PATCH /api/prescriptions/:id/review
// @access  Private/Pharmacist
export const reviewPrescription = async (req, res) => {
    try {
        const { status, reviewNotes, rejectionReason, items, deliveryFee } = req.body;

        if (!['APPROVED', 'REJECTED', 'REUPLOAD_REQUIRED'].includes(status)) {
            return errorResponse(res, 'Invalid status', 400);
        }

        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return errorResponse(res, 'Prescription not found', 404);
        }

        if (prescription.status !== 'PENDING') {
            return errorResponse(res, 'Prescription has already been reviewed', 400);
        }

        prescription.status = status;
        prescription.reviewedBy = req.user.id;
        prescription.reviewedAt = new Date();
        prescription.reviewNotes = reviewNotes;

        if (status === 'REJECTED' || status === 'REUPLOAD_REQUIRED') {
            prescription.rejectionReason = rejectionReason;
        }

        await prescription.save();

        // Update order
        const order = await Order.findById(prescription.order);

        if (status === 'APPROVED') {
            // Validate and add items
            if (!items || items.length === 0) {
                return errorResponse(res, 'Please add items to the order', 400);
            }

            let subtotal = 0;
            const orderItems = [];

            for (const item of items) {
                const product = await Product.findById(item.product);

                if (!product) {
                    return errorResponse(res, `Product ${item.product} not found`, 404);
                }

                if (product.stock < item.quantity) {
                    return errorResponse(res, `Insufficient stock for ${product.name}`, 400);
                }

                const itemSubtotal = product.price * item.quantity;
                subtotal += itemSubtotal;

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price,
                    subtotal: itemSubtotal,
                });
            }

            const finalDeliveryFee = deliveryFee || (subtotal > 5000 ? 0 : 300);
            const total = subtotal + finalDeliveryFee;

            order.items = orderItems;
            order.subtotal = subtotal;
            order.deliveryFee = finalDeliveryFee;
            order.total = total;
            order.status = 'APPROVED';
            order.pharmacist = req.user.id;

            await order.save();

            // Send price confirmation message to customer
            await Message.create({
                sender: req.user.id,
                recipient: prescription.customer,
                order: order._id,
                subject: 'Prescription Approved - Price Confirmation',
                message: `Your prescription has been approved. Total amount: Rs. ${total.toFixed(
                    2
                )} (Subtotal: Rs. ${subtotal.toFixed(2)} + Delivery: Rs. ${finalDeliveryFee.toFixed(
                    2
                )}). Please proceed with payment.`,
                messageType: 'PRICE_CONFIRMATION',
            });
        } else if (status === 'REJECTED') {
            order.status = 'REJECTED';
            await order.save();

            // Send rejection message
            await Message.create({
                sender: req.user.id,
                recipient: prescription.customer,
                order: order._id,
                subject: 'Prescription Rejected',
                message: `Your prescription has been rejected. Reason: ${rejectionReason}`,
                messageType: 'PRESCRIPTION_FEEDBACK',
            });
        } else if (status === 'REUPLOAD_REQUIRED') {
            // Send reupload request message
            await Message.create({
                sender: req.user.id,
                recipient: prescription.customer,
                order: order._id,
                subject: 'Prescription Reupload Required',
                message: `Please reupload your prescription. Reason: ${rejectionReason}`,
                messageType: 'PRESCRIPTION_FEEDBACK',
            });
        }

        // Create audit log
        await createAuditLog(
            req.user.id,
            'PRESCRIPTION_REVIEWED',
            'Prescription',
            prescription._id,
            { status, orderNumber: order.orderNumber },
            req
        );

        const updatedPrescription = await Prescription.findById(prescription._id)
            .populate('customer', 'firstName lastName email')
            .populate('order')
            .populate('reviewedBy', 'firstName lastName');

        successResponse(res, 'Prescription reviewed successfully', updatedPrescription);
    } catch (error) {
        console.error('Review prescription error:', error);
        errorResponse(res, error.message || 'Error reviewing prescription', 500);
    }
};

// @desc    Get all prescriptions (Admin)
// @route   GET /api/prescriptions
// @access  Private/Admin
export const getAllPrescriptions = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const prescriptions = await Prescription.find(query)
            .populate('customer', 'firstName lastName email')
            .populate('reviewedBy', 'firstName lastName')
            .populate('order', 'orderNumber status total')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Prescription.countDocuments(query);

        paginatedResponse(res, 'Prescriptions retrieved successfully', prescriptions, {
            page: Number(page),
            limit: Number(limit),
            total,
        });
    } catch (error) {
        console.error('Get all prescriptions error:', error);
        errorResponse(res, error.message || 'Error retrieving prescriptions', 500);
    }
};
