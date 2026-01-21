import mongoose from 'mongoose';

const pharmacistProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        licenseNumber: {
            type: String,
            required: [true, 'SLMC registration/license number is required'],
            unique: true,
            trim: true,
        },
        nic: {
            type: String,
            required: [true, 'NIC is required'],
            trim: true,
        },
        qualifications: {
            type: String,
            trim: true,
        },
        pharmacyBranch: {
            type: String,
            trim: true,
        },
        yearsOfExperience: {
            type: Number,
            min: 0,
        },
        specialization: {
            type: String,
            trim: true,
        },
        approvalStatus: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING',
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        approvedAt: {
            type: Date,
            default: null,
        },
        rejectionReason: {
            type: String,
            default: null,
        },
        documents: [
            {
                name: String,
                url: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Update user status when pharmacist is approved/rejected
pharmacistProfileSchema.pre('save', async function (next) {
    if (this.isModified('approvalStatus')) {
        const User = mongoose.model('User');

        if (this.approvalStatus === 'APPROVED') {
            await User.findByIdAndUpdate(this.user, { status: 'ACTIVE' });
            this.approvedAt = new Date();
        } else if (this.approvalStatus === 'REJECTED') {
            await User.findByIdAndUpdate(this.user, { status: 'BLOCKED' });
        } else if (this.approvalStatus === 'PENDING') {
            await User.findByIdAndUpdate(this.user, { status: 'PENDING' });
        }
    }
    next();
});

const PharmacistProfile = mongoose.model('PharmacistProfile', pharmacistProfileSchema);

export default PharmacistProfile;
