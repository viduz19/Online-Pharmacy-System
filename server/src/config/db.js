import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, 
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (error.message.includes('SSL') || error.message.includes('handshake') || error.message.includes('alert 80')) {
      console.error('\n🔒 SSL HANDSHAKE ERROR DETECTED');
      console.error('💡 This usually means your network or firewall is blocking the secure connection.');
      console.error('👉 Try turning OFF any Antivirus, Firewall, or VPN temporarily.\n');
    } else if (error.message.includes('whitelisted') || error.message.includes('IP')) {
      console.error('\n🚫 IP WHITELIST ERROR DETECTED');
      console.error('💡 MongoDB Atlas says your IP is not whitelisted, even though it may look active.');
      console.error('👉 Ensure "Allow Access from Anywhere" (0.0.0.0/0) is confirmed and active in Atlas.');
      console.error('👉 Restart your router or hotspot to get a fresh IP.\n');
    } else if (error.message.includes('ETIMEOUT') || error.message.includes('querySrv ETIMEOUT')) {
      console.error('\n📡 DNS/TIMEOUT ERROR DETECTED');
      console.error('💡 Your network is having trouble finding the MongoDB servers.');
      console.error('👉 Try using a different internet connection or a mobile hotspot if possible.\n');
    }
    
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});

export default connectDB;
