import mongoose from "mongoose";

// MongoDB connection URI from environment variables 
// MongoDB connection URI from environment variables 
const MONGODB_URI = process.env.MONGO_URI;
if (!MONGODB_URI) {
  throw new Error('MONGO_URI environment variable is required');
}

// Define the shape of our cache object using Mongoose's own types
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global NodeJS namespace to persist the cache across hot reloads in development
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Reuse existing cache or initialize a new one
const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

// Assign to global so it persists in development (Next.js hot reload)
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Start a new connection if one isn't already in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  // Await the connection and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
