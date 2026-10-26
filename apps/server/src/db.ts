
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is not configured.");
}

if (!databaseName) {
  throw new Error("MONGODB_DB is not configured.");
}

const client = new MongoClient(uri);

let database: Db | null = null;

export async function connectDatabase(): Promise<Db> {
  if (database) {
    return database;
  }

  await client.connect();

  database = client.db(databaseName);

  return database;
}
