import { MongoClient, ServerApiVersion } from "mongodb";

const connectionString =
  "mongodb+srv://admin:admin@organize.ilo2skw.mongodb.net/?retryWrites=true&w=majority";
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
