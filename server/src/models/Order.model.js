import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                subtotal: {
                    type: Number,
                    required: true,
                },
            },
        ],
        prescription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prescription',
            default: null,
        },
        status: {
            type: String,
            enum: [
                'PENDING_REVIEW',
                'APPROVED',
                'AWAITING_PAYMENT',
                'PAID',
                'PREPARING',
                'READY_FOR_DELIVERY',
                'OUT_FOR_DELIVERY',
                'DELIVERED',
                'CANCELLED',
                'REJECTED',
            ],
            default: 'PENDING_REVIEW',
        },
        subtotal: {
            type: Number,
            required: true,
            default: 0,
        },
        deliveryFee: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
            default: 0,
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'ONLINE', 'BANK_TRANSFER'],
            default: 'COD',
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
            default: 'PENDING',
        },
        paymentProof: {
            url: String,
            uploadedAt: Date,
        },
        deliveryAddress: {
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            province: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
            contactPhone: {
                type: String,
                required: true,
            },
        },
        pharmacist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        rider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        notes: {
            type: String,
            trim: true,
        },
        customerNotes: {
            type: String,
            trim: true,
        },
        pharmacistNotes: {
            type: String,
            trim: true,
        },
        statusHistory: [
            {
                status: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                note: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `VPH${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Add status to history when status changes
orderSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
        });
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
