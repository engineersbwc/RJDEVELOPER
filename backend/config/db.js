const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  // If we already have a connection, use it
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing MongoDB connection");
    return mongoose.connection;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // In serverless, we might want to clear any bad state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    throw error;
  }
};

module.exports = connectDB;
