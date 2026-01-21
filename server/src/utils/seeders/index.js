import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../../models/User.model.js';
import Category from '../../models/Category.model.js';
import Product from '../../models/Product.model.js';
import config from '../../config/env.js';
import connectDB from '../../config/db.js';

dotenv.config();

// Sample categories
const categories = [
    {
        name: 'Pain Relief',
        description: 'Medicines for pain management and relief',
    },
    {
        name: 'Antibiotics',
        description: 'Prescription antibiotics for bacterial infections',
    },
    {
        name: 'Diabetes Care',
        description: 'Medicines and supplies for diabetes management',
    },
    {
        name: 'Heart & Blood Pressure',
        description: 'Cardiovascular and hypertension medications',
    },
    {
        name: 'Digestive Health',
        description: 'Medicines for digestive system disorders',
    },
    {
        name: 'Vitamins & Supplements',
        description: 'Nutritional supplements and vitamins',
    },
    {
        name: 'Cold & Flu',
        description: 'Medicines for cold, flu, and allergies',
    },
    {
        name: 'First Aid & Wound Care',
        description: 'Antiseptics, bandages, and wound care products',
    },
    {
        name: 'Herbal & Ayurvedic',
        description: 'Traditional Sri Lankan herbal remedies',
    },
    {
        name: 'Skin Care',
        description: 'Topical treatments and skin care products',
    },
];

// Sample products (Sri Lankan market)
const products = [
    // OTC Products
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
        manufacturer: 'GlaxoSmithKline',
        usage: 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.',
        warnings: 'Do not use with other paracetamol-containing products. Consult doctor if symptoms persist.',
        activeIngredients: ['Paracetamol 500mg'],
        tags: ['pain relief', 'fever', 'headache'],
    },
    {
        name: 'Samahan',
        genericName: 'Herbal Tea',
        brand: 'Link Natural',
        categoryName: 'Herbal & Ayurvedic',
        description: 'Traditional Sri Lankan herbal remedy for cold and flu',
        dosageForm: 'Sachet',
        strength: '4g',
        price: 25,
        stock: 1000,
        prescriptionRequired: false,
        manufacturer: 'Link Natural Products',
        usage: 'Dissolve one sachet in hot water and drink. Can be taken 2-3 times daily.',
        warnings: 'Natural product. Consult doctor if pregnant or breastfeeding.',
        activeIngredients: ['Ginger', 'Black Pepper', 'Coriander', 'Cumin'],
        tags: ['herbal', 'cold', 'flu', 'immunity'],
    },
    {
        name: 'Piriton',
        genericName: 'Chlorpheniramine Maleate',
        brand: 'GSK',
        categoryName: 'Cold & Flu',
        description: 'Antihistamine for allergy relief',
        dosageForm: 'Tablet',
        strength: '4mg',
        price: 35,
        stock: 300,
        prescriptionRequired: false,
        manufacturer: 'GlaxoSmithKline',
        usage: 'Adults: 1 tablet 3-4 times daily',
        warnings: 'May cause drowsiness. Do not drive or operate machinery.',
        sideEffects: 'Drowsiness, dry mouth, dizziness',
        activeIngredients: ['Chlorpheniramine Maleate 4mg'],
        tags: ['allergy', 'antihistamine', 'itching'],
    },
    {
        name: 'ORS Sachets',
        genericName: 'Oral Rehydration Salts',
        brand: 'Jeevani',
        categoryName: 'Digestive Health',
        description: 'Oral rehydration solution for dehydration',
        dosageForm: 'Sachet',
        strength: '20.5g',
        price: 15,
        stock: 800,
        prescriptionRequired: false,
        manufacturer: 'State Pharmaceuticals Corporation',
        usage: 'Dissolve one sachet in 1 liter of clean water. Drink as needed.',
        warnings: 'Prepare fresh solution daily. Discard unused portion after 24 hours.',
        activeIngredients: ['Sodium Chloride', 'Potassium Chloride', 'Glucose'],
        tags: ['dehydration', 'diarrhea', 'electrolytes'],
    },
    {
        name: 'Dettol Antiseptic Liquid',
        genericName: 'Chloroxylenol',
        brand: 'Dettol',
        categoryName: 'First Aid & Wound Care',
        description: 'Antiseptic disinfectant for wounds and skin',
        dosageForm: 'Liquid',
        strength: '4.8% w/v',
        price: 450,
        stock: 200,
        prescriptionRequired: false,
        manufacturer: 'Reckitt Benckiser',
        usage: 'Dilute with water before use. For wounds: 1 part to 20 parts water.',
        warnings: 'For external use only. Do not swallow.',
        activeIngredients: ['Chloroxylenol 4.8%'],
        tags: ['antiseptic', 'disinfectant', 'wound care'],
    },
    {
        name: 'Vitamin C Tablets',
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
        usage: 'Take 1 tablet daily, dissolved in water',
        warnings: 'Do not exceed recommended dose',
        activeIngredients: ['Ascorbic Acid 1000mg'],
        tags: ['vitamin', 'immunity', 'supplement'],
    },
    {
        name: 'Eno Fruit Salt',
        genericName: 'Antacid',
        brand: 'Eno',
        categoryName: 'Digestive Health',
        description: 'Fast relief from acidity and indigestion',
        dosageForm: 'Sachet',
        strength: '5g',
        price: 20,
        stock: 600,
        prescriptionRequired: false,
        manufacturer: 'GSK',
        usage: 'Dissolve one sachet in water and drink immediately',
        warnings: 'Do not use for more than 14 days without consulting a doctor',
        activeIngredients: ['Sodium Bicarbonate', 'Citric Acid'],
        tags: ['antacid', 'indigestion', 'acidity'],
    },
    {
        name: 'Betadine Solution',
        genericName: 'Povidone-Iodine',
        brand: 'Betadine',
        categoryName: 'First Aid & Wound Care',
        description: 'Antiseptic solution for wound care',
        dosageForm: 'Liquid',
        strength: '10%',
        price: 380,
        stock: 180,
        prescriptionRequired: false,
        manufacturer: 'Mundipharma',
        usage: 'Apply directly to affected area or dilute as directed',
        warnings: 'May stain skin and clothing. Avoid contact with eyes.',
        activeIngredients: ['Povidone-Iodine 10%'],
        tags: ['antiseptic', 'wound care', 'iodine'],
    },
    {
        name: 'Savlon Cream',
        genericName: 'Cetrimide & Chlorhexidine',
        brand: 'Savlon',
        categoryName: 'Skin Care',
        description: 'Antiseptic cream for minor cuts and burns',
        dosageForm: 'Cream',
        strength: '0.5% + 0.1%',
        price: 250,
        stock: 220,
        prescriptionRequired: false,
        manufacturer: 'Johnson & Johnson',
        usage: 'Apply to affected area 2-3 times daily',
        warnings: 'For external use only',
        activeIngredients: ['Cetrimide 0.5%', 'Chlorhexidine Gluconate 0.1%'],
        tags: ['antiseptic', 'cream', 'wound care'],
    },
    {
        name: 'Salonsip Pain Relief Patch',
        genericName: 'Methyl Salicylate & Menthol',
        brand: 'Salonsip',
        categoryName: 'Pain Relief',
        description: 'Topical pain relief patch for muscle and joint pain',
        dosageForm: 'Patch',
        strength: '10% + 3%',
        price: 180,
        stock: 150,
        prescriptionRequired: false,
        manufacturer: 'Hisamitsu',
        usage: 'Apply patch to affected area. Can be worn for up to 8 hours.',
        warnings: 'Do not apply to broken skin or wounds',
        activeIngredients: ['Methyl Salicylate 10%', 'Menthol 3%'],
        tags: ['pain relief', 'muscle pain', 'patch'],
    },

    // Prescription Required Products
    {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        brand: 'Amoxil',
        categoryName: 'Antibiotics',
        description: 'Broad-spectrum antibiotic for bacterial infections',
        dosageForm: 'Capsule',
        strength: '500mg',
        price: 15,
        stock: 400,
        prescriptionRequired: true,
        manufacturer: 'GSK',
        usage: 'Take as prescribed by your doctor. Complete the full course.',
        warnings: 'Do not use if allergic to penicillin. May cause allergic reactions.',
        sideEffects: 'Nausea, diarrhea, skin rash',
        activeIngredients: ['Amoxicillin Trihydrate 500mg'],
        tags: ['antibiotic', 'infection', 'prescription'],
    },
    {
        name: 'Azithromycin',
        genericName: 'Azithromycin',
        brand: 'Zithromax',
        categoryName: 'Antibiotics',
        description: 'Macrolide antibiotic for respiratory infections',
        dosageForm: 'Tablet',
        strength: '500mg',
        price: 85,
        stock: 250,
        prescriptionRequired: true,
        manufacturer: 'Pfizer',
        usage: 'Take as prescribed. Usually once daily for 3-5 days.',
        warnings: 'Complete full course even if symptoms improve',
        sideEffects: 'Stomach upset, diarrhea, nausea',
        activeIngredients: ['Azithromycin 500mg'],
        tags: ['antibiotic', 'respiratory', 'prescription'],
    },
    {
        name: 'Metformin',
        genericName: 'Metformin Hydrochloride',
        brand: 'Glucophage',
        categoryName: 'Diabetes Care',
        description: 'Oral antidiabetic medication for type 2 diabetes',
        dosageForm: 'Tablet',
        strength: '500mg',
        price: 12,
        stock: 600,
        prescriptionRequired: true,
        manufacturer: 'Merck',
        usage: 'Take with meals as prescribed by your doctor',
        warnings: 'Monitor blood sugar regularly. May cause lactic acidosis in rare cases.',
        sideEffects: 'Nausea, diarrhea, stomach upset',
        activeIngredients: ['Metformin Hydrochloride 500mg'],
        tags: ['diabetes', 'blood sugar', 'prescription'],
    },
    {
        name: 'Amlodipine',
        genericName: 'Amlodipine Besylate',
        brand: 'Norvasc',
        categoryName: 'Heart & Blood Pressure',
        description: 'Calcium channel blocker for hypertension',
        dosageForm: 'Tablet',
        strength: '5mg',
        price: 18,
        stock: 500,
        prescriptionRequired: true,
        manufacturer: 'Pfizer',
        usage: 'Take once daily, with or without food',
        warnings: 'Do not stop suddenly. May cause dizziness.',
        sideEffects: 'Swelling of ankles, headache, fatigue',
        activeIngredients: ['Amlodipine Besylate 5mg'],
        tags: ['blood pressure', 'hypertension', 'prescription'],
    },
    {
        name: 'Atorvastatin',
        genericName: 'Atorvastatin Calcium',
        brand: 'Lipitor',
        categoryName: 'Heart & Blood Pressure',
        description: 'Statin for lowering cholesterol',
        dosageForm: 'Tablet',
        strength: '10mg',
        price: 22,
        stock: 450,
        prescriptionRequired: true,
        manufacturer: 'Pfizer',
        usage: 'Take once daily, preferably in the evening',
        warnings: 'Avoid grapefruit juice. Monitor liver function.',
        sideEffects: 'Muscle pain, headache, nausea',
        activeIngredients: ['Atorvastatin Calcium 10mg'],
        tags: ['cholesterol', 'statin', 'prescription'],
    },
    {
        name: 'Omeprazole',
        genericName: 'Omeprazole',
        brand: 'Losec',
        categoryName: 'Digestive Health',
        description: 'Proton pump inhibitor for acid reflux and ulcers',
        dosageForm: 'Capsule',
        strength: '20mg',
        price: 28,
        stock: 350,
        prescriptionRequired: true,
        manufacturer: 'AstraZeneca',
        usage: 'Take once daily before breakfast',
        warnings: 'Long-term use may affect calcium absorption',
        sideEffects: 'Headache, nausea, diarrhea',
        activeIngredients: ['Omeprazole 20mg'],
        tags: ['acid reflux', 'ulcer', 'prescription'],
    },
];

// Admin user
const adminUser = {
    firstName: 'Admin',
    lastName: 'Viduz',
    email: config.adminEmail,
    password: config.adminPassword,
    phone: '+94112345678',
    role: 'ADMIN',
    status: 'ACTIVE',
    address: {
        street: '123 Main Street',
        city: 'Colombo',
        province: 'Western',
        postalCode: '00100',
    },
};

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        console.log('👤 Creating admin user...');
        await User.create(adminUser);
        console.log('✅ Admin user created');

        console.log('📁 Creating categories...');
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ ${createdCategories.length} categories created`);

        console.log('💊 Creating products...');
        const productsWithCategories = products.map((product) => {
            const category = createdCategories.find((cat) => cat.name === product.categoryName);
            const { categoryName, ...productData } = product;
            return {
                ...productData,
                category: category._id,
            };
        });

        const createdProducts = await Product.insertMany(productsWithCategories);
        console.log(`✅ ${createdProducts.length} products created`);

        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ✅  Database seeded successfully!                      ║
║                                                           ║
║   👤  Admin Email: ${config.adminEmail}                 
║   🔑  Admin Password: ${config.adminPassword}                    
║                                                           ║
║   📁  Categories: ${createdCategories.length}                                     ║
║   💊  Products: ${createdProducts.length}                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
