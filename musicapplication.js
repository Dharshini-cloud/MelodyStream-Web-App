require('dotenv').config();
const http = require("http");
const { MongoClient } = require("mongodb");
const url = require("url");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");

// MongoDB Atlas connection string
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

const dbName = process.env.DB_NAME || "musicDB";
const PORT = process.env.PORT || 3000;

// Default music data (will be enhanced with data from MongoDB)
const defaultMusicLibrary = [
    { 
        id: 1, 
        title: "Rise Of Dragon", 
        artist: "Epic Music", 
        file: "/music/Rise Of Dragon.mp3",
        cover: "/public/cover1.jpg",
        duration: "3:45",
        genre: "Epic"
    },
    { 
        id: 2, 
        title: "Chillanjirukkiye", 
        artist: "Chill Artist", 
        file: "/music/Chillanjirukkiye.mp3",
        cover: "/public/cover2.jpg",
        duration: "4:20",
        genre: "Chill"
    },
    { 
        id: 3, 
        title: "Golden Sparrow", 
        artist: "Nature Sounds", 
        file: "/music/Golden Sparrow.mp3",
        cover: "/public/cover3.jpg",
        duration: "5:15",
        genre: "Ambient"
    },
    { 
        id: 4, 
        title: "Hey Minnale", 
        artist: "Romantic Hits", 
        file: "/music/Hey Minnale.mp3",
        cover: "/public/cover4.jpg",
        duration: "3:30",
        genre: "Romantic"
    },
    { 
        id: 5, 
        title: "Iraivaa", 
        artist: "Devotional", 
        file: "/music/Iraivaa.mp3",
        cover: "/public/cover5.jpg",
        duration: "6:10",
        genre: "Devotional"
    }
];

// Default playlists
const defaultPlaylists = [
    {
        id: 1,
        name: "Chill Vibes",
        description: "Relax and unwind",
        cover: "/public/playlist1.jpg",
        songs: [2, 3]
    },
    {
        id: 2,
        name: "Power Up",
        description: "Epic and motivational",
        cover: "/public/playlist2.jpg",
        songs: [1, 4]
    },
    {
        id: 3,
        name: "Feel Good",
        description: "Happy moments",
        cover: "/public/playlist3.jpg",
        songs: [4, 5]
    }
];

// Global variables for music data
let musicLibrary = [...defaultMusicLibrary];
let playlists = [...defaultPlaylists];
let isDBConnected = false;

// Serve static files
function serveStatic(req, res) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("File not found");
        } else {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
                ".gif": "image/gif", ".css": "text/css", ".js": "application/javascript"
            };
            res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
            res.end(data);
        }
    });
}

// Serve music files
function serveMusic(req, res) {
    const fileName = req.url.replace("/music/", "");
    const filePath = path.join(__dirname, "music", fileName);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error("Error serving music file:", err);
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Music file not found");
        } else {
            res.writeHead(200, { "Content-Type": "audio/mpeg" });
            res.end(data);
        }
    });
}

// Function to load music data from MongoDB
async function loadMusicData() {
    try {
        console.log("🔄 Connecting to MongoDB Atlas...");
        await client.connect();
        const db = client.db(dbName);
        isDBConnected = true;
        
        // Load songs from mySongs collection
        const songsFromDB = await db.collection("mySongs").find().toArray();
        if (songsFromDB.length > 0) {
            console.log(`✅ Found ${songsFromDB.length} songs in mySongs collection`);
            musicLibrary = songsFromDB.map((song, index) => ({
                id: index + 1,
                title: song.title || "Unknown Title",
                artist: song.artist || "Unknown Artist",
                file: song.url || `/music/${song.title || 'song'}.mp3`,
                cover: song.cover || `/public/cover${(index % 5) + 1}.jpg`,
                duration: song.duration || "3:00",
                genre: song.genre || "Various"
            }));
        } else {
            console.log("ℹ️ No songs found in mySongs collection, using default data");
        }
        
        // Load users count
        const usersCount = await db.collection("users").countDocuments();
        console.log(`✅ Found ${usersCount} users in database`);
        
    } catch (error) {
        console.error("❌ Error connecting to MongoDB Atlas:", error.message);
        console.log("🔄 Using default music data");
        isDBConnected = false;
    }
}

// Enhanced CSS styles
const styles = `
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :root {
        --primary: #667eea;
        --primary-dark: #5a6fd8;
        --secondary: #764ba2;
        --accent: #f093fb;
        --danger: #f5576c;
        --success: #4ade80;
        --dark: #1a202c;
        --light: #f7fafc;
        --gray: #718096;
        --card-bg: rgba(255, 255, 255, 0.95);
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        color: var(--dark);
        line-height: 1.6;
    }

    .glass-container {
        max-width: 1200px;
        margin: 20px auto;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    }

    .header {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        padding: 40px 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .header h1 {
        font-size: 3em;
        font-weight: 800;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        position: relative;
    }

    .header p {
        font-size: 1.2em;
        opacity: 0.9;
        position: relative;
    }

    .content {
        padding: 40px;
        background: var(--light);
    }

    /* Navigation */
    .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #e2e8f0;
    }

    .nav-links {
        display: flex;
        gap: 20px;
    }

    .nav-link {
        color: var(--dark);
        text-decoration: none;
        font-weight: 600;
        padding: 10px 20px;
        border-radius: 25px;
        transition: all 0.3s ease;
    }

    .nav-link:hover, .nav-link.active {
        background: var(--primary);
        color: white;
        transform: translateY(-2px);
    }

    /* Button Styles */
    .btn {
        padding: 12px 30px;
        border: none;
        border-radius: 50px;
        font-size: 1em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
    }

    .btn-secondary {
        background: linear-gradient(135deg, var(--accent), var(--danger));
        color: white;
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    /* Form Styles */
    .form-container {
        max-width: 400px;
        margin: 0 auto;
    }

    .form-group {
        margin-bottom: 25px;
    }

    .form-input {
        width: 100%;
        padding: 15px 20px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 1em;
        transition: all 0.3s ease;
        background: white;
    }

    .form-input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* Music Grid */
    .music-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }

    .music-card {
        background: var(--card-bg);
        border-radius: 15px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.5);
        position: relative;
        overflow: hidden;
    }

    .music-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .music-card:hover::before {
        opacity: 1;
    }

    .music-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }

    .album-art {
        width: 120px;
        height: 120px;
        border-radius: 12px;
        margin: 0 auto 15px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2em;
        position: relative;
        overflow: hidden;
    }

    .music-card h3 {
        margin-bottom: 5px;
        font-weight: 700;
    }

    .music-card p {
        color: var(--gray);
        font-size: 0.9em;
    }

    .play-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.3s ease;
        font-size: 1.2em;
    }

    .music-card:hover .play-overlay {
        opacity: 1;
    }

    /* Playlist Styles */
    .playlist-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 20px 0;
    }

    .playlist-card {
        background: var(--card-bg);
        border-radius: 15px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .playlist-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .playlist-cover {
        width: 100px;
        height: 100px;
        border-radius: 12px;
        margin: 0 auto 15px;
        background: linear-gradient(135deg, var(--accent), var(--danger));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5em;
    }

    /* Music Player */
    .music-player {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }

    .player-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .player-info {
        flex: 1;
        min-width: 200px;
    }

    .player-controls {
        display: flex;
        align-items: center;
        gap: 15px;
        flex: 2;
    }

    .song-title {
        font-weight: 700;
        font-size: 1.1em;
        margin-bottom: 5px;
    }

    .song-artist {
        color: var(--gray);
        font-size: 0.9em;
    }

    .control-btn {
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.1em;
    }

    .control-btn:hover {
        background: var(--primary-dark);
        transform: scale(1.1);
    }

    .progress-container {
        flex: 3;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .progress-bar {
        flex: 1;
        height: 6px;
        background: #e2e8f0;
        border-radius: 3px;
        overflow: hidden;
        cursor: pointer;
    }

    .progress {
        height: 100%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        width: 0%;
        transition: width 0.1s ease;
    }

    .time {
        font-size: 0.8em;
        color: var(--gray);
        min-width: 40px;
    }

    /* Section Styles */
    .section {
        margin-bottom: 40px;
    }

    .section-title {
        font-size: 1.5em;
        font-weight: 700;
        margin-bottom: 20px;
        color: var(--dark);
        display: flex;
        align-items: center;
        gap: 10px;
    }

    /* Utility Classes */
    .text-center { text-align: center; }
    .mb-20 { margin-bottom: 20px; }
    .mt-20 { margin-top: 20px; }
    .flex { display: flex; }
    .justify-center { justify-content: center; }
    .items-center { align-items: center; }
    .gap-15 { gap: 15px; }

    /* Message Styles */
    .message {
        padding: 15px 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: center;
    }

    .success {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }

    .error {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fecaca;
    }

    .info {
        background: #dbeafe;
        color: #1e40af;
        border: 1px solid #93c5fd;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .glass-container {
            margin: 10px;
            border-radius: 15px;
        }

        .content {
            padding: 20px;
        }

        .header h1 {
            font-size: 2em;
        }

        .music-grid {
            grid-template-columns: 1fr;
        }

        .player-container {
            flex-direction: column;
            gap: 15px;
        }

        .nav-container {
            flex-direction: column;
            gap: 15px;
        }
    }
</style>
`;

// Initialize music data from MongoDB
loadMusicData();

// Handle requests
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Serve static files
    if (req.url.startsWith("/public/") || req.url.match(/\.(jpg|jpeg|png|gif|css|js)$/)) {
        return serveStatic(req, res);
    }

    // Serve music files
    if (req.url.startsWith("/music/")) {
        return serveMusic(req, res);
    }

    // Home Page
    if (parsedUrl.pathname === "/" && req.method === "GET") {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>MelodyStream - Your Music Paradise</title>
                ${styles}
            </head>
            <body>
                <div class="glass-container">
                    <div class="header">
                        <h1>🎵 MelodyStream</h1>
                        <p>Your Ultimate Music Experience</p>
                    </div>
                    <div class="content">
                        ${!isDBConnected ? `
                            <div class="message info">
                                <p>🔌 MongoDB Connection: <strong>Offline</strong> - Using demo data</p>
                            </div>
                        ` : `
                            <div class="message success">
                                <p>✅ MongoDB Connection: <strong>Online</strong> - Using database data</p>
                            </div>
                        `}
                        <div class="text-center">
                            <h2 style="font-size: 2.5em; margin-bottom: 10px; color: var(--dark);">Welcome to MelodyStream</h2>
                            <p style="font-size: 1.2em; color: var(--gray); margin-bottom: 40px;">
                                Discover, stream, and enjoy millions of songs with crystal-clear quality
                            </p>
                            
                            <div class="flex justify-center gap-15">
                                <a href="/login" class="btn btn-primary">
                                    <span>🎯</span> Login
                                </a>
                                <a href="/signup" class="btn btn-secondary">
                                    <span>✨</span> Sign Up Free
                                </a>
                            </div>

                            <div style="margin-top: 50px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">🎧</div>
                                    <h3>High Quality</h3>
                                    <p style="color: var(--gray);">Lossless audio quality</p>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">📱</div>
                                    <h3>Any Device</h3>
                                    <p style="color: var(--gray);">Stream anywhere, anytime</p>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">🎨</div>
                                    <h3>Curated Playlists</h3>
                                    <p style="color: var(--gray);">Handpicked music collections</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    }

    // Signup Page
    else if (parsedUrl.pathname === "/signup" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sign Up - MelodyStream</title>
                ${styles}
            </head>
            <body>
                <div class="glass-container" style="max-width: 450px;">
                    <div class="header">
                        <h1>Join MelodyStream</h1>
                        <p>Start your musical adventure today</p>
                    </div>
                    <div class="content">
                        ${!isDBConnected ? `
                            <div class="message info">
                                <p>🔌 Database Offline - Registration data won't be saved</p>
                            </div>
                        ` : ''}
                        <div class="form-container">
                            <form method="POST" action="/signup">
                                <div class="form-group">
                                    <input type="text" name="fullname" class="form-input" placeholder="Enter your full name" required>
                                </div>
                                <div class="form-group">
                                    <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
                                </div>
                                <div class="form-group">
                                    <input type="text" name="username" class="form-input" placeholder="Choose a username" required>
                                </div>
                                <div class="form-group">
                                    <input type="password" name="password" class="form-input" placeholder="Create a password" required>
                                </div>
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    <span>🚀</span> Create Account
                                </button>
                            </form>
                            <p class="text-center mt-20">
                                Already have an account? <a href="/login" style="color: var(--primary); text-decoration: none; font-weight: 600;">Sign in here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    }

    else if (parsedUrl.pathname === "/signup" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", async () => {
            const formData = querystring.parse(body);
            
            if (!isDBConnected) {
                // Demo mode - redirect to login with username
                res.writeHead(302, { 
                    Location: `/login?demo=true&username=${encodeURIComponent(formData.username)}` 
                });
                res.end();
                return;
            }

            try {
                await client.connect();
                const db = client.db(dbName);
                
                // Check if user already exists
                const existingUser = await db.collection("users").findOne({
                    $or: [
                        { username: formData.username },
                        { email: formData.email }
                    ]
                });

                if (existingUser) {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Error - MelodyStream</title>
                            ${styles}
                        </head>
                        <body>
                            <div class="glass-container" style="max-width: 500px;">
                                <div class="content">
                                    <div class="message error">
                                        <h2>❌ User Already Exists</h2>
                                        <p>Username or email already registered. Please try different credentials.</p>
                                    </div>
                                    <div class="text-center">
                                        <a href="/signup" class="btn btn-primary">Try Again</a>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `);
                    return;
                }

                // Add registration date
                formData.registeredAt = new Date().toISOString();
                await db.collection("users").insertOne(formData);

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Success - MelodyStream</title>
                        ${styles}
                    </head>
                    <body>
                        <div class="glass-container" style="max-width: 500px;">
                            <div class="content">
                                <div class="message success">
                                    <h2>Registration Successful!</h2>
                                    <p>Your account has been created successfully in the database.</p>
                                    <p><small>Welcome to MelodyStream!</small></p>
                                </div>
                                <div class="text-center">
                                    <a href="/login" class="btn btn-primary">Proceed to Login</a>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `);
            } catch (error) {
                console.error("Database error:", error);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Error - MelodyStream</title>
                        ${styles}
                    </head>
                    <body>
                        <div class="glass-container" style="max-width: 500px;">
                            <div class="content">
                                <div class="message error">
                                    <h2>Registration Failed</h2>
                                    <p>Error: ${error.message}</p>
                                </div>
                                <div class="text-center">
                                    <a href="/signup" class="btn btn-primary">Try Again</a>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `);
            }
        });
    }

    // Login Page
    else if (parsedUrl.pathname === "/login" && req.method === "GET") {
        const demo = parsedUrl.query.demo;
        const username = parsedUrl.query.username;
        
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Login - MelodyStream</title>
                ${styles}
            </head>
            <body>
                <div class="glass-container" style="max-width: 450px;">
                    <div class="header">
                        <h1>Welcome Back</h1>
                        <p>Continue your musical journey</p>
                    </div>
                    <div class="content">
                        ${demo ? `
                            <div class="message info">
                                <p>🔌 Demo Mode - Using temporary session</p>
                            </div>
                        ` : !isDBConnected ? `
                            <div class="message info">
                                <p>🔌 Database Offline - Login with any credentials for demo</p>
                            </div>
                        ` : ''}
                        <div class="form-container">
                            <form method="POST" action="/login">
                                <div class="form-group">
                                    <input type="text" name="username" class="form-input" placeholder="Enter your username or email" value="${username || ''}" required>
                                </div>
                                <div class="form-group">
                                    <input type="password" name="password" class="form-input" placeholder="Enter your password" required>
                                </div>
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    <span>🎵</span> Login to MelodyStream
                                </button>
                            </form>
                            <p class="text-center mt-20">
                                New to MelodyStream? <a href="/signup" style="color: var(--primary); text-decoration: none; font-weight: 600;">Create an account</a>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    }

    else if (parsedUrl.pathname === "/login" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", async () => {
            const formData = querystring.parse(body);
            const username = formData.username || "User";
            
            if (!isDBConnected) {
                // Demo mode - allow any login
                res.writeHead(302, { 
                    Location: `/dashboard?username=${encodeURIComponent(username)}&demo=true` 
                });
                res.end();
                return;
            }

            try {
                await client.connect();
                const db = client.db(dbName);

                const user = await db.collection("users").findOne({
                    $or: [
                        { username: formData.username, password: formData.password },
                        { email: formData.username, password: formData.password }
                    ]
                });

                if (user) {
                    // Redirect to dashboard with username
                    res.writeHead(302, { 
                        Location: `/dashboard?username=${encodeURIComponent(user.username)}` 
                    });
                    res.end();
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Login Failed - MelodyStream</title>
                            ${styles}
                        </head>
                        <body>
                            <div class="glass-container" style="max-width: 500px;">
                                <div class="content">
                                    <div class="message error">
                                        <h2>❌ Login Failed</h2>
                                        <p>Invalid username/email or password.</p>
                                    </div>
                                    <div class="text-center">
                                        <a href="/login" class="btn btn-primary">Try Again</a>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `);
                }
            } catch (error) {
                console.error("Database error:", error);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Error - MelodyStream</title>
                        ${styles}
                    </head>
                    <body>
                        <div class="glass-container" style="max-width: 500px;">
                            <div class="content">
                                <div class="message error">
                                    <h2>❌ Login Error</h2>
                                    <p>Database connection failed: ${error.message}</p>
                                </div>
                                <div class="text-center">
                                    <a href="/login" class="btn btn-primary">Try Again</a>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `);
            }
        });
    }

    // Dashboard Page
    else if (parsedUrl.pathname === "/dashboard" && req.method === "GET") {
        const username = parsedUrl.query.username || "Music Lover";
        const demo = parsedUrl.query.demo;

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Dashboard - MelodyStream</title>
                ${styles}
            </head>
            <body>
                <div class="glass-container">
                    <div class="header">
                        <h1>Hello, ${username}! 👋</h1>
                        <p>Ready to discover your next favorite song?</p>
                    </div>
                    <div class="content">
                        ${demo ? `
                            <div class="message info">
                                <p>🔌 Demo Mode - Temporary session</p>
                            </div>
                        ` : ''}
                        ${!isDBConnected ? `
                            <div class="message info">
                                <p>🔌 Using demo music data - ${musicLibrary.length} songs available</p>
                            </div>
                        ` : `
                            <div class="message success">
                                <p>✅ Connected to MongoDB - ${musicLibrary.length} songs loaded</p>
                            </div>
                        `}
                        
                        <div class="nav-container">
                            <div>
                                <h2 style="color: var(--dark);">Your Dashboard</h2>
                            </div>
                            <div class="nav-links">
                                <a href="/dashboard?username=${encodeURIComponent(username)}${demo ? '&demo=true' : ''}" class="nav-link active">Dashboard</a>
                                <a href="/library?username=${encodeURIComponent(username)}${demo ? '&demo=true' : ''}" class="nav-link">Library</a>
                                <a href="/" class="nav-link">Logout</a>
                            </div>
                        </div>

                        <!-- Recently Played -->
                        <div class="section">
                            <div class="section-title">
                                <span>🎵</span> Recently Played
                            </div>
                            <div class="music-grid">
                                ${musicLibrary.slice(0, 3).map(song => `
                                    <div class="music-card" onclick="playSong(${song.id})">
                                        <div class="album-art">
                                            <span>${song.title.charAt(0)}</span>
                                        </div>
                                        <h3>${song.title}</h3>
                                        <p>${song.artist}</p>
                                        <p style="color: var(--gray); font-size: 0.8em; margin-top: 5px;">${song.duration} • ${song.genre}</p>
                                        <div class="play-overlay">▶</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Your Playlists -->
                        <div class="section">
                            <div class="section-title">
                                <span>🎼</span> Your Playlists
                            </div>
                            <div class="playlist-grid">
                                ${playlists.map(playlist => `
                                    <div class="playlist-card" onclick="viewPlaylist(${playlist.id})">
                                        <div class="playlist-cover">
                                            <span>${playlist.name.charAt(0)}</span>
                                        </div>
                                        <h3>${playlist.name}</h3>
                                        <p style="color: var(--gray); font-size: 0.9em;">${playlist.description}</p>
                                        <p style="color: var(--gray); font-size: 0.8em; margin-top: 5px;">${playlist.songs.length} songs</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Recommended For You -->
                        <div class="section">
                            <div class="section-title">
                                <span>🔥</span> Recommended For You
                            </div>
                            <div class="music-grid">
                                ${musicLibrary.slice(3).map(song => `
                                    <div class="music-card" onclick="playSong(${song.id})">
                                        <div class="album-art">
                                            <span>${song.title.charAt(0)}</span>
                                        </div>
                                        <h3>${song.title}</h3>
                                        <p>${song.artist}</p>
                                        <p style="color: var(--gray); font-size: 0.8em; margin-top: 5px;">${song.duration} • ${song.genre}</p>
                                        <div class="play-overlay">▶</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Music Player -->
                <div class="music-player" id="musicPlayer" style="display: none;">
                    <div class="player-container">
                        <div class="player-info">
                            <div class="song-title" id="currentSongTitle">Select a song to play</div>
                            <div class="song-artist" id="currentSongArtist">-</div>
                        </div>
                        <div class="player-controls">
                            <button class="control-btn" onclick="previousSong()">⏮</button>
                            <button class="control-btn" onclick="togglePlay()" id="playBtn">▶</button>
                            <button class="control-btn" onclick="nextSong()">⏭</button>
                        </div>
                        <div class="progress-container">
                            <span class="time" id="currentTime">0:00</span>
                            <div class="progress-bar" onclick="seekAudio(event)">
                                <div class="progress" id="progress"></div>
                            </div>
                            <span class="time" id="duration">0:00</span>
                        </div>
                    </div>
                    <audio id="audioPlayer" ontimeupdate="updateProgress()" onloadedmetadata="updateDuration()"></audio>
                </div>

                <script>
                    let currentSong = null;
                    let currentSongIndex = 0;
                    let isPlaying = false;
                    const audioPlayer = document.getElementById('audioPlayer');
                    const musicPlayer = document.getElementById('musicPlayer');
                    const songs = ${JSON.stringify(musicLibrary)};

                    function playSong(songId) {
                        const song = songs.find(s => s.id === songId);
                        if (song) {
                            currentSong = song;
                            currentSongIndex = songs.findIndex(s => s.id === songId);
                            
                            document.getElementById('currentSongTitle').textContent = song.title;
                            document.getElementById('currentSongArtist').textContent = song.artist;
                            audioPlayer.src = song.file;
                            musicPlayer.style.display = 'block';
                            togglePlay();
                        }
                    }

                    function togglePlay() {
                        const playBtn = document.getElementById('playBtn');
                        if (isPlaying) {
                            audioPlayer.pause();
                            playBtn.innerHTML = '▶';
                        } else {
                            audioPlayer.play().catch(e => {
                                console.log('Audio play failed:', e);
                                alert('Now playing: ' + currentSong.title + ' by ' + currentSong.artist);
                            });
                            playBtn.innerHTML = '⏸';
                        }
                        isPlaying = !isPlaying;
                    }

                    function previousSong() {
                        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
                        playSong(songs[currentSongIndex].id);
                    }

                    function nextSong() {
                        currentSongIndex = (currentSongIndex + 1) % songs.length;
                        playSong(songs[currentSongIndex].id);
                    }

                    function updateProgress() {
                        const progress = document.getElementById('progress');
                        const currentTime = document.getElementById('currentTime');
                        const value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                        progress.style.width = value + '%';
                        
                        // Update current time
                        const minutes = Math.floor(audioPlayer.currentTime / 60);
                        const seconds = Math.floor(audioPlayer.currentTime % 60);
                        currentTime.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                    }

                    function updateDuration() {
                        const duration = document.getElementById('duration');
                        const minutes = Math.floor(audioPlayer.duration / 60);
                        const seconds = Math.floor(audioPlayer.duration % 60);
                        duration.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                    }

                    function seekAudio(event) {
                        const progressBar = event.currentTarget;
                        const clickPosition = event.offsetX;
                        const totalWidth = progressBar.offsetWidth;
                        const percentage = clickPosition / totalWidth;
                        
                        if (audioPlayer.duration) {
                            audioPlayer.currentTime = percentage * audioPlayer.duration;
                        }
                    }

                    function viewPlaylist(playlistId) {
                        const playlist = ${JSON.stringify(playlists)}.find(p => p.id === playlistId);
                        if (playlist) {
                            alert('Opening playlist: ' + playlist.name + '\\nSongs: ' + playlist.songs.length);
                            // In a real app, this would navigate to the playlist page
                        }
                    }

                    // Auto-play first song for demo
                    setTimeout(() => {
                        if (songs.length > 0 && !currentSong) {
                            playSong(songs[0].id);
                        }
                    }, 2000);
                </script>
            </body>
            </html>
        `);
    }

    // Library Page
    else if (parsedUrl.pathname === "/library" && req.method === "GET") {
        const username = parsedUrl.query.username || "Music Lover";
        const demo = parsedUrl.query.demo;

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Music Library - MelodyStream</title>
                ${styles}
            </head>
            <body>
                <div class="glass-container">
                    <div class="header">
                        <h1>Your Music Library 🎶</h1>
                        <p>All your favorite songs in one place</p>
                    </div>
                    <div class="content">
                        ${demo ? `
                            <div class="message info">
                                <p>🔌 Demo Mode - Temporary session</p>
                            </div>
                        ` : ''}
                        ${!isDBConnected ? `
                            <div class="message info">
                                <p>🔌 Using demo music data</p>
                            </div>
                        ` : `
                            <div class="message success">
                                <p>✅ Connected to MongoDB</p>
                            </div>
                        `}
                        
                        <div class="nav-container">
                            <div>
                                <h2 style="color: var(--dark);">Browse Collection</h2>
                            </div>
                            <div class="nav-links">
                                <a href="/dashboard?username=${encodeURIComponent(username)}${demo ? '&demo=true' : ''}" class="nav-link">Dashboard</a>
                                <a href="/library?username=${encodeURIComponent(username)}${demo ? '&demo=true' : ''}" class="nav-link active">Library</a>
                                <a href="/" class="nav-link">Logout</a>
                            </div>
                        </div>

                        <!-- Search Bar -->
                        <div style="margin-bottom: 30px;">
                            <input type="text" class="form-input" placeholder="🔍 Search songs, artists, or genres..." 
                                   style="font-size: 1.1em; padding: 15px 20px;" onkeyup="filterSongs(this.value)">
                        </div>

                        <!-- All Songs -->
                        <div class="section">
                            <div class="section-title">
                                <span>🎵</span> All Songs (${musicLibrary.length} tracks)
                            </div>
                            <div class="music-grid" id="musicGrid">
                                ${musicLibrary.map(song => `
                                    <div class="music-card" onclick="playSong(${song.id})" 
                                         data-title="${song.title.toLowerCase()}" 
                                         data-artist="${song.artist.toLowerCase()}"
                                         data-genre="${song.genre.toLowerCase()}">
                                        <div class="album-art">
                                            <span>${song.title.charAt(0)}</span>
                                        </div>
                                        <h3>${song.title}</h3>
                                        <p>${song.artist}</p>
                                        <p style="color: var(--gray); font-size: 0.8em; margin-top: 5px;">${song.duration} • ${song.genre}</p>
                                        <div class="play-overlay">▶</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Music Player (same as dashboard) -->
                <div class="music-player" id="musicPlayer" style="display: none;">
                    <div class="player-container">
                        <div class="player-info">
                            <div class="song-title" id="currentSongTitle">Select a song to play</div>
                            <div class="song-artist" id="currentSongArtist">-</div>
                        </div>
                        <div class="player-controls">
                            <button class="control-btn" onclick="previousSong()">⏮</button>
                            <button class="control-btn" onclick="togglePlay()" id="playBtn">▶</button>
                            <button class="control-btn" onclick="nextSong()">⏭</button>
                        </div>
                        <div class="progress-container">
                            <span class="time" id="currentTime">0:00</span>
                            <div class="progress-bar" onclick="seekAudio(event)">
                                <div class="progress" id="progress"></div>
                            </div>
                            <span class="time" id="duration">0:00</span>
                        </div>
                    </div>
                    <audio id="audioPlayer" ontimeupdate="updateProgress()" onloadedmetadata="updateDuration()"></audio>
                </div>

                <script>
                    let currentSong = null;
                    let currentSongIndex = 0;
                    let isPlaying = false;
                    const audioPlayer = document.getElementById('audioPlayer');
                    const musicPlayer = document.getElementById('musicPlayer');
                    const songs = ${JSON.stringify(musicLibrary)};

                    function playSong(songId) {
                        const song = songs.find(s => s.id === songId);
                        if (song) {
                            currentSong = song;
                            currentSongIndex = songs.findIndex(s => s.id === songId);
                            
                            document.getElementById('currentSongTitle').textContent = song.title;
                            document.getElementById('currentSongArtist').textContent = song.artist;
                            audioPlayer.src = song.file;
                            musicPlayer.style.display = 'block';
                            togglePlay();
                        }
                    }

                    function togglePlay() {
                        const playBtn = document.getElementById('playBtn');
                        if (isPlaying) {
                            audioPlayer.pause();
                            playBtn.innerHTML = '▶';
                        } else {
                            audioPlayer.play().catch(e => {
                                console.log('Audio play failed:', e);
                                alert('Now playing: ' + currentSong.title + ' by ' + currentSong.artist);
                            });
                            playBtn.innerHTML = '⏸';
                        }
                        isPlaying = !isPlaying;
                    }

                    function previousSong() {
                        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
                        playSong(songs[currentSongIndex].id);
                    }

                    function nextSong() {
                        currentSongIndex = (currentSongIndex + 1) % songs.length;
                        playSong(songs[currentSongIndex].id);
                    }

                    function updateProgress() {
                        const progress = document.getElementById('progress');
                        const currentTime = document.getElementById('currentTime');
                        const value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                        progress.style.width = value + '%';
                        
                        const minutes = Math.floor(audioPlayer.currentTime / 60);
                        const seconds = Math.floor(audioPlayer.currentTime % 60);
                        currentTime.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                    }

                    function updateDuration() {
                        const duration = document.getElementById('duration');
                        const minutes = Math.floor(audioPlayer.duration / 60);
                        const seconds = Math.floor(audioPlayer.duration % 60);
                        duration.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                    }

                    function seekAudio(event) {
                        const progressBar = event.currentTarget;
                        const clickPosition = event.offsetX;
                        const totalWidth = progressBar.offsetWidth;
                        const percentage = clickPosition / totalWidth;
                        
                        if (audioPlayer.duration) {
                            audioPlayer.currentTime = percentage * audioPlayer.duration;
                        }
                    }

                    function filterSongs(searchTerm) {
                        const cards = document.querySelectorAll('.music-card');
                        const term = searchTerm.toLowerCase();
                        
                        cards.forEach(card => {
                            const title = card.getAttribute('data-title');
                            const artist = card.getAttribute('data-artist');
                            const genre = card.getAttribute('data-genre');
                            
                            if (title.includes(term) || artist.includes(term) || genre.includes(term)) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    }

                    // Auto-play first song for demo
                    setTimeout(() => {
                        if (songs.length > 0 && !currentSong) {
                            playSong(songs[0].id);
                        }
                    }, 1000);
                </script>
            </body>
            </html>
        `);
    }

    // 404 Page
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 - MelodyStream</title>
                ${styles}
            </head>
            <body>
                <div class="glass-container" style="max-width: 500px; text-align: center;">
                    <div class="header">
                        <h1>404</h1>
                        <p>Page Not Found</p>
                    </div>
                    <div class="content">
                        <div style="font-size: 4em; margin-bottom: 20px;">🎵</div>
                        <h2 style="margin-bottom: 20px;">Oops! This page doesn't exist.</h2>
                        <p style="color: var(--gray); margin-bottom: 30px;">
                            The music page you're looking for seems to have skipped a beat.
                        </p>
                        <a href="/" class="btn btn-primary">Back to Home</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`🎵 MelodyStream server running at http://localhost:${PORT}`);
    console.log(`📊 Database: ${dbName}`);
    console.log(`📁 Collections: users, mySongs`);
    console.log(`🌐 MongoDB Atlas: Cluster0`);
    console.log(`🎶 Songs loaded: ${musicLibrary.length}`);
});