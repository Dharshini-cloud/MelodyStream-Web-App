require('dotenv').config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
