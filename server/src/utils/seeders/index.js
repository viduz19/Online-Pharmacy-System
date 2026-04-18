import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../../models/User.model.js';
import Category from '../../models/Category.model.js';
import Product from '../../models/Product.model.js';
import PharmacistProfile from '../../models/PharmacistProfile.model.js';
import config from '../../config/env.js';
import connectDB from '../../config/db.js';

dotenv.config();

// Sample categories
const categories = [
    { name: 'Pain Relief', description: 'Medicines for pain management' },
    { name: 'Antibiotics', description: 'Bacterial infection medications' },
    { name: 'Vitamins & Supplements', description: 'Supplements for health' },
    { name: 'Herbal & Ayurvedic', description: 'Traditional remedies' }
];

// Sample products
const products = [
    {
        name: 'Panadol',
        genericName: 'Paracetamol',
        brand: 'GSK',
        categoryName: 'Pain Relief',
        description: 'Effective pain relief and fever reduction',
        dosageForm: 'Tablet',
        strength: '500mg',
        price: 45,
        stock: 500,
        prescriptionRequired: false,
        manufacturer: 'GSK',
        images: [{ url: '/assets/Panadol (Paracetamol 500mg).png', alt: 'Panadol' }]
    },
    {
        name: 'Vitamin C',
        genericName: 'Ascorbic Acid',
        brand: 'Redoxon',
        categoryName: 'Vitamins & Supplements',
        description: 'Vitamin C supplement for immunity',
        dosageForm: 'Tablet',
        strength: '1000mg',
        price: 850,
        stock: 150,
        prescriptionRequired: false,
        manufacturer: 'Bayer',
        images: [{ url: '/assets/Vitamin c.png', alt: 'Vitamin C' }]
    },
    {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        brand: 'Amoxil',
        categoryName: 'Antibiotics',
        description: 'Broad-spectrum antibiotic',
        dosageForm: 'Capsule',
        strength: '500mg',
        price: 15,
        stock: 400,
        prescriptionRequired: true,
        manufacturer: 'GSK'
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing all existing data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await PharmacistProfile.deleteMany({});

        console.log('👤 Creating main accounts...');

        // 1. Admin
        const admin = await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@viduzpharmacy.lk',
            password: 'Admin@123',
            phone: '+94112345678',
            role: 'ADMIN',
            status: 'ACTIVE'
        });

        // 2. Pharmacist
        const pharmacist = await User.create({
            firstName: 'John',
            lastName: 'Pharmacist',
            email: 'pharmacist@viduzpharmacy.lk',
            password: 'Pharmacist@123',
            phone: '+94771234567',
            role: 'PHARMACIST',
            status: 'ACTIVE'
        });

        // Pharmacist Profile
        await PharmacistProfile.create({
            user: pharmacist._id,
            licenseNumber: 'SLMC-12345',
            nic: '199012345678',
            yearsOfExperience: 5,
            qualifications: 'B.Pharm',
            pharmacyBranch: 'Colombo 07',
            specialization: 'General Pharmacy',
            approvalStatus: 'APPROVED'
        });

        // 3. Customer
        await User.create({
            firstName: 'Vidusha',
            lastName: 'Puswalkatiya',
            email: 'customer@gmail.com',
            password: 'Customer@123',
            phone: '+94719876543',
            role: 'CUSTOMER',
            status: 'ACTIVE'
        });

        console.log('📁 Creating categories...');
        const createdCategories = [];
        for (const cat of categories) {
            const created = await Category.create(cat);
            createdCategories.push(created);
        }

        console.log('💊 Creating products...');
        const productsWithCategories = products.map(p => {
            const cat = createdCategories.find(c => c.name === p.categoryName);
            const { categoryName, ...rest } = p;
            return { ...rest, category: cat._id };
        });
        await Product.insertMany(productsWithCategories);

        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
