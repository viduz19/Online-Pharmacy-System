import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import Prescription from '../models/Prescription.model.js';
import Message from '../models/Message.model.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { createAuditLog } from '../utils/auditLog.js';

// @desc    Create order (OTC products)
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod, customerNotes } = req.body;

        if (!items || items.length === 0) {
            return errorResponse(res, 'No items in order', 400);
        }

        // Validate and calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return errorResponse(res, `Product ${item.product} not found`, 404);
            }

            if (product.prescriptionRequired) {
                return errorResponse(
                    res,
                    `Product ${product.name} requires a prescription. Please use the prescription upload flow.`,
                    400
                );
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

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Calculate delivery fee (simple logic - can be enhanced)
        const deliveryFee = subtotal > 5000 ? 0 : 300; // Free delivery over Rs. 5000
        const total = subtotal + deliveryFee;

        // Create order
        const order = await Order.create({
            customer: req.user.id,
            items: orderItems,
            subtotal,
            deliveryFee,
            total,
            deliveryAddress,
            paymentMethod,
            customerNotes,
            status: paymentMethod === 'COD' ? 'PAID' : 'AWAITING_PAYMENT',
            paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        });

        // Create audit log
        await createAuditLog(req.user.id, 'ORDER_CREATED', 'Order', order._id, { orderNumber: order.orderNumber }, req);

        const populatedOrder = await Order.findById(order._id)
            .populate('customer', 'firstName lastName email phone')
            .populate('items.product', 'name brand price');

        successResponse(res, 'Order created successfully', populatedOrder, 201);
    } catch (error) {
        console.error('Create order error:', error);
        errorResponse(res, error.message || 'Error creating order', 500);
    }
};

// @desc    Get customer orders
// @route   GET /api/orders/my-orders
// @access  Private/Customer
export const getMyOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = { customer: req.user.id };

        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .populate('items.product', 'name brand images')
            .populate('prescription')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Order.countDocuments(query);

        paginatedResponse(res, 'Orders retrieved successfully', orders, {
            page: Number(page),
            limit: Number(limit),
            total,
        });
    } catch (error) {
        console.error('Get my orders error:', error);
        errorResponse(res, error.message || 'Error retrieving orders', 500);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'firstName lastName email phone address')
            .populate('items.product', 'name brand genericName strength dosageForm images')
            .populate('prescription')
            .populate('pharmacist', 'firstName lastName')
            .populate('rider', 'firstName lastName phone');

        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }

        // Check authorization
        if (
            req.user.role === 'CUSTOMER' &&
            order.customer._id.toString() !== req.user.id
        ) {
            return errorResponse(res, 'Not authorized to access this order', 403);
        }

        successResponse(res, 'Order retrieved successfully', order);
    } catch (error) {
        console.error('Get order error:', error);
        errorResponse(res, error.message || 'Error retrieving order', 500);
    }
};

// @desc    Get all orders (Admin/Pharmacist)
// @route   GET /api/orders
// @access  Private/Admin/Pharmacist
export const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.orderNumber = { $regex: search, $options: 'i' };
        }

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .populate('customer', 'firstName lastName email phone')
            .populate('items.product', 'name brand')
            .populate('pharmacist', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Order.countDocuments(query);

        paginatedResponse(res, 'Orders retrieved successfully', orders, {
            page: Number(page),
            limit: Number(limit),
            total,
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        errorResponse(res, error.message || 'Error retrieving orders', 500);
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Pharmacist/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }

        const oldStatus = order.status;
        order.status = status;

        // Add to status history
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            updatedBy: req.user.id,
            note,
        });

        // Assign pharmacist if not assigned
        if (!order.pharmacist && req.user.role === 'PHARMACIST') {
            order.pharmacist = req.user.id;
        }

        await order.save();

        // Send notification to customer
        await Message.create({
            sender: req.user.id,
            recipient: order.customer,
            order: order._id,
            subject: 'Order Status Update',
            message: `Your order ${order.orderNumber} status has been updated to ${status}. ${note || ''}`,
            messageType: 'ORDER_UPDATE',
        });

        // Create audit log
        await createAuditLog(
            req.user.id,
            'ORDER_STATUS_UPDATED',
            'Order',
            order._id,
            { orderNumber: order.orderNumber, statusChange: { from: oldStatus, to: status } },
            req
        );

        const updatedOrder = await Order.findById(order._id)
            .populate('customer', 'firstName lastName email')
            .populate('items.product', 'name brand');

        successResponse(res, 'Order status updated successfully', updatedOrder);
    } catch (error) {
        console.error('Update order status error:', error);
        errorResponse(res, error.message || 'Error updating order status', 500);
    }
};

// @desc    Upload payment proof
// @route   POST /api/orders/:id/payment-proof
// @access  Private/Customer
export const uploadPaymentProof = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }

        if (order.customer.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized', 403);
        }

        if (!req.file) {
            return errorResponse(res, 'Please upload a payment proof image', 400);
        }

        order.paymentProof = {
            url: req.file.path,
            uploadedAt: new Date(),
        };
        order.paymentStatus = 'PAID';
        order.status = 'PAID';

        await order.save();

        successResponse(res, 'Payment proof uploaded successfully', order);
    } catch (error) {
        console.error('Upload payment proof error:', error);
        errorResponse(res, error.message || 'Error uploading payment proof', 500);
    }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private/Customer
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }

        if (order.customer.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized', 403);
        }

        // Can only cancel if not yet preparing
        if (['PREPARING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) {
            return errorResponse(res, 'Cannot cancel order at this stage', 400);
        }

        order.status = 'CANCELLED';
        await order.save();

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        successResponse(res, 'Order cancelled successfully', order);
    } catch (error) {
        console.error('Cancel order error:', error);
        errorResponse(res, error.message || 'Error cancelling order', 500);
    }
};
