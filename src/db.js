import { MongoClient } from "mongodb";

const connectionString = 
"mongodb+srv://admin:admin@organize.ilo2skw.mongodb.net/";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
let dbs = conn.db("ORGanize");
export default dbs;