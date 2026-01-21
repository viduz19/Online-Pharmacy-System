import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        genericName: {
            type: String,
            trim: true,
        },
        brand: {
            type: String,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        dosageForm: {
            type: String,
            enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Sachet', 'Liquid', 'Patch', 'Other'],
            required: true,
        },
        strength: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 10,
        },
        prescriptionRequired: {
            type: Boolean,
            default: false,
        },
        images: [
            {
                url: String,
                alt: String,
            },
        ],
        manufacturer: {
            type: String,
            trim: true,
        },
        warnings: {
            type: String,
            trim: true,
        },
        sideEffects: {
            type: String,
            trim: true,
        },
        usage: {
            type: String,
            trim: true,
        },
        activeIngredients: [String],
        isActive: {
            type: Boolean,
            default: true,
        },
        tags: [String],
    },
    {
        timestamps: true,
    }
);

// Index for search functionality
productSchema.index({ name: 'text', genericName: 'text', brand: 'text', description: 'text' });

// Virtual for stock status
productSchema.virtual('stockStatus').get(function () {
    if (this.stock === 0) return 'OUT_OF_STOCK';
    if (this.stock <= this.lowStockThreshold) return 'LOW_STOCK';
    return 'IN_STOCK';
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
