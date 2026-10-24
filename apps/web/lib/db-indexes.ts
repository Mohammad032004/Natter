
import clientPromise from "@/lib/mongodb";

export async function ensureUserIndexes() {
  const client = await clientPromise;
  const db = client.db();

  const users = db.collection("users");

  await users.createIndex(
    { email: 1 },
    { unique: true, name: "unique_user_email" }
  );

  await users.createIndex(
    { username: 1 },
    { unique: true, name: "unique_user_username" }
  );
}
