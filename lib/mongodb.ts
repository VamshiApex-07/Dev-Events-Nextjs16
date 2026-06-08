import mongoose from "mongoose";
import { URL } from "url";

// MongoDB connection URI from environment variables
function getMongoUri(): string {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI environment variable is required');
  return uri;
}

interface SrvRecord {
  name: string;
  port: number;
  priority: number;
  weight: number;
}

// Node.js on Windows uses c-ares for DNS, which fails to resolve SRV records
// through local/router DNS servers. Use Google DNS-over-HTTPS to resolve
// SRV records via HTTP, completely bypassing the OS resolver.
async function resolveSrvViaDoh(hostname: string): Promise<SrvRecord[]> {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=SRV`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DNS-over-HTTPS failed: ${res.status}`);
  const body: { Answer?: { name: string; type: number; data: string }[] } = await res.json();
  if (!body.Answer) throw new Error(`No SRV records found for ${hostname}`);

  return body.Answer
    .filter((a) => a.type === 33) // SRV record type
    .map((a) => {
      const [priority, weight, port, ...nameParts] = a.data.split(/\s+/);
      return {
        name: nameParts.join(" ").replace(/\.$/, ""), // strip trailing FQDN dot
        port: parseInt(port, 10),
        priority: parseInt(priority, 10),
        weight: parseInt(weight, 10),
      };
    });
}

// Node.js on Windows uses c-ares for DNS, which fails to resolve SRV records
// through local/router DNS servers. Resolve SRV records manually over HTTPS and build
// a standard mongodb:// URI to bypass c-ares SRV resolution.
async function resolveSrvUri(srvUri: string): Promise<string> {
  if (!srvUri.startsWith("mongodb+srv://")) return srvUri;

  const url = new URL(srvUri);
  const records = await resolveSrvViaDoh(`_mongodb._tcp.${url.hostname}`);
  const hosts = records
    .sort((a, b) => a.priority - b.priority || a.weight - b.weight)
    .map((r) => `${r.name}:${r.port}`)
    .join(",");

  // Preserve all query params and add tls=true (implied by mongodb+srv:// but not by mongodb://)
  const params = new URLSearchParams(url.searchParams);
  if (!params.has("tls") && !params.has("ssl")) params.set("tls", "true");
  const db = url.pathname.replace(/^\//, "");
  return `mongodb://${url.username}:${url.password}@${hosts}/${db}?${params.toString()}`;
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
    const raw = getMongoUri();
    const uri = raw.startsWith("mongodb+srv://")
      ? await resolveSrvUri(raw)
      : raw;
    cached.promise = mongoose.connect(uri).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  // Await the connection and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
