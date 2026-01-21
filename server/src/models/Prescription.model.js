import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null,
        },
        files: [
            {
                filename: {
                    type: String,
                    required: true,
                },
                originalName: {
                    type: String,
                    required: true,
                },
                path: {
                    type: String,
                    required: true,
                },
                mimetype: {
                    type: String,
                    required: true,
                },
                size: {
                    type: Number,
                    required: true,
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        requestedMedicines: [
            {
                productName: String,
                quantity: Number,
                notes: String,
            },
        ],
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'REUPLOAD_REQUIRED'],
            default: 'PENDING',
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
        reviewNotes: {
            type: String,
            trim: true,
        },
        rejectionReason: {
            type: String,
            trim: true,
        },
        customerNotes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
