import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Order from './src/models/Order.model.js';
import Prescription from './src/models/Prescription.model.js';
import Message from './src/models/Message.model.js';
import AuditLog from './src/models/AuditLog.model.js';

const clearTestData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected.');

        console.log('Clearing Orders...');
        const ordersRes = await Order.deleteMany({});
        console.log(`Deleted ${ordersRes.deletedCount} orders.`);
        
        console.log('Clearing Prescriptions...');
        const presRes = await Prescription.deleteMany({});
        console.log(`Deleted ${presRes.deletedCount} prescriptions.`);
        
        console.log('Clearing Messages...');
        const msgRes = await Message.deleteMany({});
        console.log(`Deleted ${msgRes.deletedCount} messages.`);
        
        console.log('Clearing AuditLogs...');
        const logRes = await AuditLog.deleteMany({});
        console.log(`Deleted ${logRes.deletedCount} audit logs.`);

        console.log('Test data cleared successfully! Kept Users, Pharmacist Profiles, Products, and Categories.');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    }
};

clearTestData();
