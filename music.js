const http = require("http");
const url = require("url");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

// Sample music data (replace with your actual music files)
const musicLibrary = [
    { id: 1, title: "Chill Vibes", artist: "Lofi Producer", cover: "/public/cover1.jpg", file: "/music/song1.mp3", duration: "3:45" },
    { id: 2, title: "Summer Waves", artist: "Beach Sound", cover: "/public/cover2.jpg", file: "/music/song2.mp3", duration: "4:20" },
    { id: 3, title: "Mountain Top", artist: "Nature Sounds", cover: "/public/cover3.jpg", file: "/music/song3.mp3", duration: "5:15" },
    { id: 4, title: "City Lights", artist: "Urban Beats", cover: "/public/cover4.jpg", file: "/music/song4.mp3", duration: "3:30" },
    { id: 5, title: "Dreamscape", artist: "Ambient Music", cover: "/public/cover5.jpg", file: "/music/song5.mp3", duration: "6:10" },
    { id: 6, title: "Energy Boost", artist: "Workout Mix", cover: "/public/cover6.jpg", file: "/music/song6.mp3", duration: "3:55" }
];

// In-memory user storage (replace with database in production)
let users = [];

// Modern CSS Styles
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
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
        justify-content: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
    }

    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s;
    }

    .btn:hover::before {
        left: 100%;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
    }

    .btn-secondary {
        background: linear-gradient(135deg, var(--accent), var(--danger));
        color: white;
    }

    .btn-outline {
        background: transparent;
        border: 2px solid var(--primary);
        color: var(--primary);
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
        position: relative;
    }

    .form-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: var(--dark);
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

    /* Music Player */
    .music-player {
        background: var(--card-bg);
        border-radius: 15px;
        padding: 25px;
        margin-top: 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .player-controls {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
    }

    .player-info {
        flex: 1;
    }

    .song-title {
        font-size: 1.3em;
        font-weight: 700;
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
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .control-btn:hover {
        background: var(--primary-dark);
        transform: scale(1.1);
    }

    .progress-bar {
        width: 100%;
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

    /* Music Grid */
    .music-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
    }

    .music-card:hover .play-overlay {
        opacity: 1;
    }

    /* Navigation */
    .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .nav-links {
        display: flex;
        gap: 20px;
    }

    .nav-link {
        color: var(--dark);
        text-decoration: none;
        font-weight: 600;
        padding: 8px 16px;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .nav-link:hover, .nav-link.active {
        background: var(--primary);
        color: white;
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

        .nav-container {
            flex-direction: column;
            gap: 15px;
        }
    }
</style>
`;

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
                ".gif": "image/gif", ".mp3": "audio/mpeg", ".css": "text/css",
                ".js": "application/javascript", ".html": "text/html"
            };
            res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
            res.end(data);
        }
    });
}

// Serve music files
function serveMusic(req, res) {
    const filePath = path.join(__dirname, "music", req.url.replace("/music/", ""));
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Music file not found");
        } else {
            res.writeHead(200, { "Content-Type": "audio/mpeg" });
            res.end(data);
        }
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Serve static files
    if (req.url.startsWith("/public/") || req.url.match(/\.(jpg|jpeg|png|gif|mp3|css|js)$/)) {
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

    // Login Page
    else if (parsedUrl.pathname === "/login" && req.method === "GET") {
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
                        <div class="form-container">
                            <form method="POST" action="/login" id="loginForm">
                                <div class="form-group">
                                    <label class="form-label">Username or Email</label>
                                    <input type="text" name="username" class="form-input" placeholder="Enter your username or email" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Password</label>
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
                <script>
                    document.getElementById('loginForm').addEventListener('submit', function(e) {
                        e.preventDefault();
                        // For demo purposes, accept any login
                        const formData = new FormData(this);
                        const username = formData.get('username');
                        if (username) {
                            window.location.href = '/home?username=' + encodeURIComponent(username);
                        }
                    });
                </script>
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
                        <div class="form-container">
                            <form method="POST" action="/signup" id="signupForm">
                                <div class="form-group">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" name="fullname" class="form-input" placeholder="Enter your full name" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Username</label>
                                    <input type="text" name="username" class="form-input" placeholder="Choose a username" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Password</label>
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
                <script>
                    document.getElementById('signupForm').addEventListener('submit', function(e) {
                        e.preventDefault();
                        // For demo purposes, redirect to login
                        window.location.href = '/login';
                    });
                </script>
            </body>
            </html>
        `);
    }

    // Home Page (After Login)
    else if (parsedUrl.pathname === "/home" && req.method === "GET") {
        const username = parsedUrl.query.username || "Music Lover";

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Home - MelodyStream</title>
                ${styles}
            </head>
            <body>
                <div class="glass-container">
                    <div class="header">
                        <h1>Hello, ${username}! 👋</h1>
                        <p>Ready to discover your next favorite song?</p>
                    </div>
                    <div class="content">
                        <div class="nav-container">
                            <div>
                                <h2 style="color: var(--dark);">Your Dashboard</h2>
                            </div>
                            <div class="nav-links">
                                <a href="/home?username=${encodeURIComponent(username)}" class="nav-link active">Home</a>
                                <a href="/library?username=${encodeURIComponent(username)}" class="nav-link">Library</a>
                                <a href="/" class="nav-link">Logout</a>
                            </div>
                        </div>

                        <!-- Featured Section -->
                        <div style="margin-bottom: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--dark);">🔥 Featured Playlists</h3>
                            <div class="music-grid">
                                ${musicLibrary.slice(0, 4).map(song => `
                                    <div class="music-card" onclick="playSong(${song.id})">
                                        <div class="album-art">🎵</div>
                                        <h3>${song.title}</h3>
                                        <p>${song.artist}</p>
                                        <div class="play-overlay">▶</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Recently Played -->
                        <div style="margin-bottom: 40px;">
                            <h3 style="margin-bottom: 20px; color: var(--dark);">🎧 Recently Played</h3>
                            <div class="music-grid">
                                ${musicLibrary.slice(2, 6).map(song => `
                                    <div class="music-card" onclick="playSong(${song.id})">
                                        <div class="album-art">🎶</div>
                                        <h3>${song.title}</h3>
                                        <p>${song.artist}</p>
                                        <div class="play-overlay">▶</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="flex justify-center gap-15">
                            <a href="/library?username=${encodeURIComponent(username)}" class="btn btn-primary">
                                <span>📚</span> Browse Library
                            </a>
                            <button class="btn btn-outline" onclick="showPlayer()">
                                <span>🎵</span> Now Playing
                            </button>
                        </div>
                    </div>
                </div>

                <script>
                    function playSong(songId) {
                        const song = ${JSON.stringify(musicLibrary)}.find(s => s.id === songId);
                        if (song) {
                            localStorage.setItem('currentSong', JSON.stringify(song));
                            showPlayer();
                        }
                    }

                    function showPlayer() {
                        const song = JSON.parse(localStorage.getItem('currentSong'));
                        if (song) {
                            alert('Now playing: ' + song.title + ' by ' + song.artist);
                            // In a real app, this would open the music player
                            window.location.href = '/library?username=${encodeURIComponent(username)}';
                        } else {
                            alert('No song selected. Please choose a song from the library.');
                        }
                    }
                </script>
            </body>
            </html>
        `);
    }

    // Music Library Page
    else if (parsedUrl.pathname === "/library" && req.method === "GET") {
        const username = parsedUrl.query.username || "Music Lover";

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
                        <div class="nav-container">
                            <div>
                                <h2 style="color: var(--dark);">Browse Collection</h2>
                            </div>
                            <div class="nav-links">
                                <a href="/home?username=${encodeURIComponent(username)}" class="nav-link">Home</a>
                                <a href="/library?username=${encodeURIComponent(username)}" class="nav-link active">Library</a>
                                <a href="/" class="nav-link">Logout</a>
                            </div>
                        </div>

                        <!-- Search Bar -->
                        <div style="margin-bottom: 30px;">
                            <input type="text" class="form-input" placeholder="🔍 Search songs, artists, or albums..." 
                                   style="font-size: 1.1em; padding: 15px 20px;" onkeyup="filterSongs(this.value)">
                        </div>

                        <!-- Music Grid -->
                        <div class="music-grid" id="musicGrid">
                            ${musicLibrary.map(song => `
                                <div class="music-card" onclick="playSong(${song.id})" data-title="${song.title.toLowerCase()}" data-artist="${song.artist.toLowerCase()}">
                                    <div class="album-art" style="background: linear-gradient(135deg, #${Math.random().toString(16).slice(2,8)}, #${Math.random().toString(16).slice(2,8)})">
                                        ${song.title.charAt(0)}
                                    </div>
                                    <h3>${song.title}</h3>
                                    <p>${song.artist}</p>
                                    <p style="color: var(--gray); font-size: 0.8em; margin-top: 5px;">${song.duration}</p>
                                    <div class="play-overlay">▶</div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Music Player -->
                        <div class="music-player" id="musicPlayer" style="display: none;">
                            <div class="player-controls">
                                <div class="player-info">
                                    <div class="song-title" id="currentSongTitle">Select a song to play</div>
                                    <div class="song-artist" id="currentSongArtist">-</div>
                                </div>
                                <button class="control-btn" onclick="togglePlay()" id="playBtn">▶</button>
                            </div>
                            <div class="progress-bar" onclick="seekAudio(event)">
                                <div class="progress" id="progress"></div>
                            </div>
                            <audio id="audioPlayer" ontimeupdate="updateProgress()"></audio>
                        </div>
                    </div>
                </div>

                <script>
                    let currentSong = null;
                    let isPlaying = false;
                    const audioPlayer = document.getElementById('audioPlayer');
                    const musicPlayer = document.getElementById('musicPlayer');

                    function playSong(songId) {
                        const songs = ${JSON.stringify(musicLibrary)};
                        currentSong = songs.find(s => s.id === songId);
                        
                        if (currentSong) {
                            document.getElementById('currentSongTitle').textContent = currentSong.title;
                            document.getElementById('currentSongArtist').textContent = currentSong.artist;
                            audioPlayer.src = currentSong.file;
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
                                alert('Audio file not found. This is a demo - in a real app, music would play here.');
                            });
                            playBtn.innerHTML = '⏸';
                        }
                        isPlaying = !isPlaying;
                    }

                    function updateProgress() {
                        const progress = document.getElementById('progress');
                        const value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                        progress.style.width = value + '%';
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
                            
                            if (title.includes(term) || artist.includes(term)) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    }

                    // Demo: Auto-play first song on page load
                    setTimeout(() => {
                        if (!currentSong) {
                            playSong(1);
                        }
                    }, 1000);
                </script>
            </body>
            </html>
        `);
    }

    // Handle POST requests (demo purposes)
    else if ((parsedUrl.pathname === "/login" || parsedUrl.pathname === "/signup") && req.method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            const formData = querystring.parse(body);
            const username = formData.username || "User";
            
            res.writeHead(302, { 
                Location: `/home?username=${encodeURIComponent(username)}` 
            });
            res.end();
        });
    }

    // 404 Page
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Page Not Found - MelodyStream</title>
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
    console.log(`📁 Make sure you have a 'public' folder for images and 'music' folder for audio files`);
});