import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null,
        },
        subject: {
            type: String,
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'Message content is required'],
            trim: true,
        },
        messageType: {
            type: String,
            enum: ['PRICE_CONFIRMATION', 'ORDER_UPDATE', 'PRESCRIPTION_FEEDBACK', 'GENERAL'],
            default: 'GENERAL',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
            default: null,
        },
        attachments: [
            {
                filename: String,
                path: String,
                mimetype: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ order: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
