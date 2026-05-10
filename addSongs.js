// addSongs.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);

const songsToAdd = [
  {
    title: "Rise Of Dragon",
    artist: "Epic Music",
    url: "/music/Rise Of Dragon.mp3",
    cover: "/public/cover1.jpg",
    duration: "3:45",
    genre: "Epic"
  },
  {
    title: "Chillanjirukkiye", 
    artist: "Chill Artist",
    url: "/music/Chillanjirukkiye.mp3",
    cover: "/public/cover2.jpg",
    duration: "4:20",
    genre: "Chill"
  },
  {
    title: "Golden Sparrow",
    artist: "Nature Sounds",
    url: "/music/Golden Sparrow.mp3", 
    cover: "/public/cover3.jpg",
    duration: "5:15",
    genre: "Ambient"
  },
  {
    title: "Hey Minnale",
    artist: "Romantic Hits", 
    url: "/music/Hey Minnale.mp3",
    cover: "/public/cover4.jpg",
    duration: "3:30",
    genre: "Romantic"
  },
  {
    title: "Iraivaa",
    artist: "Devotional",
    url: "/music/Iraivaa.mp3",
    cover: "/public/cover5.jpg", 
    duration: "6:10",
    genre: "Devotional"
  }
];

async function addSongs() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || "musicDB");
    const collection = db.collection("mySongs");
    
    // Clear existing songs (optional)
    await collection.deleteMany({});
    
    // Insert new songs
    const result = await collection.insertMany(songsToAdd);
    console.log(`✅ Successfully added ${result.insertedCount} songs to MongoDB Atlas!`);
    
  } catch (error) {
    console.error("❌ Error adding songs:", error);
  } finally {
    await client.close();
  }
}

addSongs();