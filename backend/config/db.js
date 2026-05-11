const mongoose = require("mongoose");

// Store connection globally to reuse across warm Lambda invocations
let cachedConnection = null;

const connectDB = async (options = {}) => {
  // If we have a cached connection and it's ready, return it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("✅ Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in environment variables. " +
        "Please add it to your Vercel project settings."
      );
    }

    console.log("🔄 Establishing new MongoDB connection...");

    // Optimized connection settings for Vercel serverless
    const mongoOptions = {
      // Connection timeout (default 30s, we use 10s for faster failure detection)
      serverSelectionTimeoutMS: 10000,
      
      // Socket timeout - how long to wait for socket operations
      socketTimeoutMS: 45000,
      
      // Connection pool settings
      maxPoolSize: 10,                    // Max connections in pool
      minPoolSize: 2,                     // Min connections to keep
      maxIdleTimeMS: 30000,               // Close idle connections after 30s
      
      // Wait queue settings
      waitQueueTimeoutMS: 10000,          // Max time to wait for connection from pool
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Other optimizations
      connectTimeoutMS: 10000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // For serverless: don't keep connections between requests
      serverMonitoringMode: 'poll',
      
      ...options
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    
    // Cache the connection for this Lambda container
    cachedConnection = conn;
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // If connection was partially established, disconnect to clean up
    if (mongoose.connection.readyState !== 0) {
      try {
        await mongoose.disconnect();
      } catch (disconnectErr) {
        console.error("Error disconnecting:", disconnectErr.message);
      }
    }
    
    cachedConnection = null;
    throw new Error(
      `Database connection failed: ${error.message}. ` +
      `Ensure MongoDB URI is correct and your IP is whitelisted in MongoDB Atlas.`
    );
  }
};

// Graceful disconnect handler for Lambda termination
const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      cachedConnection = null;
      console.log("📴 MongoDB disconnected");
    }
  } catch (error) {
    console.error("Error during disconnect:", error.message);
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
