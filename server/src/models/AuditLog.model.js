import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: [
                'USER_LOGIN',
                'USER_LOGOUT',
                'USER_REGISTER',
                'PHARMACIST_APPROVED',
                'PHARMACIST_REJECTED',
                'PRODUCT_CREATED',
                'PRODUCT_UPDATED',
                'PRODUCT_DELETED',
                'ORDER_CREATED',
                'ORDER_STATUS_UPDATED',
                'PRESCRIPTION_REVIEWED',
                'USER_BLOCKED',
                'USER_ACTIVATED',
                'CATEGORY_CREATED',
                'CATEGORY_UPDATED',
                'CATEGORY_DELETED',
            ],
        },
        targetModel: {
            type: String,
            enum: ['User', 'Product', 'Order', 'Prescription', 'Category', 'PharmacistProfile'],
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ targetModel: 1, targetId: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
