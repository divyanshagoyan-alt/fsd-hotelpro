import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelpro';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    isConnected = false;
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB at ${uri}.`);
    console.warn(`[MongoDB] Reason: ${err.message}`);
    console.warn(`[MongoDB] The server will still respond with fallback / in-memory handlers when MongoDB is offline.`);
    return null;
  }
}

export function getDBStatus() {
  return {
    connected: isConnected,
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelpro',
    readyState: mongoose.connection.readyState,
  };
}
