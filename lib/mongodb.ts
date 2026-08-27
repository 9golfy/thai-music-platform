import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGODB_URI or MONGO_URI environment variable is not set. Please add it to .env.local');
    }
    
    // Extract database name from URI if not provided in MONGO_DB
    let dbName = process.env.MONGO_DB;
    
    if (!dbName) {
      // Try to extract from URI: mongodb://user:pass@host:port/dbname?options
      const match = uri.match(/\/([^/?]+)(\?|$)/);
      dbName = match ? match[1] : 'thai_music_school';
      console.log('📝 Database name extracted from URI:', dbName);
    }
    
    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 URI:', uri.replace(/\/\/.*@/, '//<credentials>@')); // Hide credentials in log
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;
    
    console.log('✅ MongoDB connected successfully to database:', dbName);
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}
