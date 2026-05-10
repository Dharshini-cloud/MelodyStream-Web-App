require('dotenv').config();
const http = require("http");
const { MongoClient } = require("mongodb");
const url = require("url");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);
const dbName = process.env.DB_NAME || "musicdb";
let db; // database reference

const PORT = process.env.PORT || 3000;

// ✅ Tamil + English Songs
const songs = [
  // Tamil
  { title: "Vaathi Coming", url: "/music/vaathi_coming.mp3" },
  { title: "Why This Kolaveri Di", url: "/music/kolaveri.mp3" },
  { title: "Rowdy Baby", url: "/music/rowdy_baby.mp3" },
  { title: "Aalaporan Thamizhan", url: "/music/aalaporan_thamizhan.mp3" },
  { title: "Enjoy Enjaami", url: "/music/enjoy_enjaami.mp3" },
  // English
  { title: "Shape of You", url: "/music/shape_of_you.mp3" },
  { title: "Blinding Lights", url: "/music/blinding_lights.mp3" },
  { title: "Perfect", url: "/music/perfect.mp3" },
  { title: "Believer", url: "/music/believer.mp3" },
  { title: "Levitating", url: "/music/levitating.mp3" }
];

// Connect once at startup + seed songs
async function initDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB Atlas");

    const songCount = await db.collection("mysongs").countDocuments();
    if (songCount === 0) {
      await db.collection("mysongs").insertMany(songs);
      console.log("🎵 Songs inserted into DB");
    }
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
}
initDB();

// Serve static music files
function serveMusic(req, res) {
  const filePath = path.join(__dirname, req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
    } else {
      res.writeHead(200, { "Content-Type": "audio/mpeg" });
      res.end(data);
    }
  });
}

// CSS styles
const styles = `
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height:100vh; color:#333; padding:20px; }
    .container { max-width:800px; margin:0 auto; background:white; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.2); overflow:hidden; }
    .header { background: linear-gradient(135deg,#ff6b6b 0%,#ee5a24 100%); color:white; padding:30px 20px; text-align:center; }
    .header h1 { font-size:2.5em; margin-bottom:10px; text-shadow:2px 2px 4px rgba(0,0,0,0.3); }
    .header p { font-size:1.2em; opacity:0.9; }
    .content { padding:40px; }
    .button-container { display:flex; gap:15px; justify-content:center; margin:20px 0; }
    .btn { padding:12px 25px; border:none; border-radius:25px; font-size:1em; font-weight:600; cursor:pointer; transition:all 0.3s ease; text-decoration:none; display:inline-block; }
    .btn-primary { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:white; }
    .btn-secondary { background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%); color:white; }
    .btn:hover { transform:translateY(-2px); box-shadow:0 5px 15px rgba(0,0,0,0.2); }
    .form-container { max-width:400px; margin:0 auto; }
    .form-group { margin-bottom:20px; }
    input[type="text"],input[type="email"],input[type="password"] { width:100%; padding:12px 15px; border:2px solid #e1e5e9; border-radius:8px; font-size:1em; transition:border-color 0.3s ease; }
    input:focus { outline:none; border-color:#667eea; }
    .song-list { display:grid; gap:10px; margin:30px 0; }
    .song-btn { padding:15px 20px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:white; border:none; border-radius:10px; font-size:1.1em; cursor:pointer; text-align:left; display:flex; align-items:center; gap:10px; transition:all 0.3s ease; }
    .song-btn:hover { transform:translateX(5px); box-shadow:0 5px 15px rgba(0,0,0,0.2); }
    .song-btn::before { content:'▶'; font-size:0.8em; }
    .audio-player { width:100%; margin-top:30px; border-radius:10px; background:#f8f9fa; padding:20px; }
    .message { padding:15px; border-radius:8px; margin:20px 0; text-align:center; }
    .success { background:#d4edda; color:#155724; border:1px solid #c3e6cb; }
    .error { background:#f8d7da; color:#721c24; border:1px solid #f5c6cb; }
    .link { color:#667eea; text-decoration:none; font-weight:600; }
    .link:hover { text-decoration:underline; }
  </style>
`;

// Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.url.startsWith("/music/")) return serveMusic(req, res);

  // Home page
  if (parsedUrl.pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <!DOCTYPE html><html><head><title>Music App</title>${styles}</head>
      <body>
        <div class="container">
          <div class="header"><h1>Welcome to My Music App</h1><p>Stream your favorite songs anytime!</p></div>
          <div class="content">
            <div class="button-container">
              <form action="/login" method="get"><button class="btn btn-primary">Login</button></form>
              <form action="/signup" method="get"><button class="btn btn-secondary">Sign Up</button></form>
            </div>
          </div>
        </div>
      </body></html>
    `);
  }

  // Signup GET
  else if (parsedUrl.pathname === "/signup" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html><html><head><title>Sign Up</title>${styles}</head>
      <body><div class="container">
        <div class="header"><h1>Create Your Account</h1></div>
        <div class="content">
          <div class="form-container">
            <form method="POST" action="/signup">
              <div class="form-group"><input type="text" name="username" placeholder="Username" required></div>
              <div class="form-group"><input type="email" name="email" placeholder="Email" required></div>
              <div class="form-group"><input type="password" name="password" placeholder="Password" required></div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Create Account</button>
            </form>
          </div>
        </div>
      </div></body></html>
    `);
  }

  // Signup POST
  else if (parsedUrl.pathname === "/signup" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      const formData = querystring.parse(body);
      const exists = await db.collection("users").findOne({ username: formData.username });
      if (exists) {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(`<h2>⚠️ Username already taken. <a href="/signup">Try again</a></h2>`);
      }
      await db.collection("users").insertOne(formData);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<h2>✅ Registration Successful! <a href="/login">Login Now</a></h2>`);
    });
  }

  // Login GET
  else if (parsedUrl.pathname === "/login" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html><html><head><title>Login</title>${styles}</head>
      <body><div class="container">
        <div class="header"><h1>Login</h1></div>
        <div class="content">
          <div class="form-container">
            <form method="POST" action="/login">
              <div class="form-group"><input type="text" name="username" placeholder="Username" required></div>
              <div class="form-group"><input type="password" name="password" placeholder="Password" required></div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Login</button>
            </form>
          </div>
        </div>
      </div></body></html>
    `);
  }

  // Login POST
  else if (parsedUrl.pathname === "/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      const formData = querystring.parse(body);
      const user = await db.collection("users").findOne({
        username: formData.username,
        password: formData.password
      });

      if (!user) {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(`<h2>❌ Invalid login. <a href="/login">Try Again</a></h2>`);
      }

      const mysongs = await db.collection("mysongs").find().toArray();
      let songHTML = "<h2>Your Music Library</h2><div class='song-list'>";
      mysongs.forEach(song => {
        songHTML += `<button class="song-btn" onclick="playSong('${song.url}')">${song.title}</button>`;
      });
      songHTML += `</div>
        <div class="audio-player">
          <audio id="player" controls style="width:100%;">
            <source id="audioSource" src="" type="audio/mpeg">
          </audio>
        </div>
        <script>
          function playSong(src) {
            var player = document.getElementById("player");
            var source = document.getElementById("audioSource");
            source.src = src;
            player.load();
            player.play();
          }
        </script>`;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<!DOCTYPE html><html><head><title>Library</title>${styles}</head>
        <body><div class="container">
          <div class="header"><h1>Hello, ${user.username} 👋</h1></div>
          <div class="content">${songHTML}</div>
        </div></body></html>`);
    });
  }

  // 404
  else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(`<h2>404 Page Not Found</h2><a href="/">Go Home</a>`);
  }
});

server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
