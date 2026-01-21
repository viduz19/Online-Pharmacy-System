import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE'
];

// Validate required environment variables
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`❌ Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});

const config = {
    port: process.env.PORT || 5000,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    nodeEnv: process.env.NODE_ENV || 'development',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    uploadPath: process.env.UPLOAD_PATH || './src/uploads/prescriptions',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@viduzpharmacy.lk',
    adminPassword: process.env.ADMIN_PASSWORD || 'Admin@123'
};

export default config;
