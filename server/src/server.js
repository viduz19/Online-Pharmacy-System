import config from './config/env.js';
import connectDB from './config/db.js';
import app from './app.js';

// Connect to database
connectDB();

const PORT = config.port;

const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏥  Viduz Pharmacy API Server                          ║
║                                                           ║
║   🚀  Server running on port ${PORT}                        ║
║   🌍  Environment: ${config.nodeEnv}                    ║
║   📡  API: http://localhost:${PORT}/api                    ║
║   ❤️   Health: http://localhost:${PORT}/api/health         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Process terminated');
    });
});
