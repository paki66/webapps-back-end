import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const connectionString = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
const client = new MongoClient(connectionString);
let connection;
try {
  console.log("Trying to establish connection...");
  connection = await client.connect();
} catch (e) {
  console.error(e);
}

let db = connection.db("ORGanize");
export default db;
