require('dotenv').config();
const { MongoClient } = require("mongodb");

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);


async function insertSongs() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || "musicDB");
    const songsCollection = db.collection("mysongs");

    // 🎵 English + Tamil Songs
    const songs = [
      // ✅ Your Tamil songs
      { title: "Hey Minnale", url: "/music/Hey Minnale.mp3" },
      { title: "Iraivaa", url: "/music/Iraivaa.mp3" },
      { title: "Rise Of Dragon", url: "/music/Rise Of Dragon.mp3" },
      { title: "Chillanjirukkiye", url: "/music/Chillanjirukkiye.mp3" },
      { title: "Golden Sparrow", url: "/music/Golden Sparrow.mp3" }
    ];

    await songsCollection.deleteMany({}); // clear old data
    await songsCollection.insertMany(songs);

    console.log("✅ English + Tamil songs inserted successfully into mysongs collection!");
  } catch (err) {
    console.error("❌ Error inserting songs:", err);
  } finally {
    await client.close();
  }
}

insertSongs();
