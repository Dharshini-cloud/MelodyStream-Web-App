# 🎵 MelodyStream – Music Streaming Web App

A full-featured music streaming web application built with **pure Node.js (no frameworks)** and **MongoDB Atlas**, featuring secure authentication, real-time updates, and seamless audio playback with a modern glass-morphism UI.

## 🚀 Features

- 🎧 Music Playback – Stream Tamil and English songs seamlessly  
- 🔐 User Authentication – JWT-based login and registration  
- ☁️ MongoDB Atlas Integration – Cloud database for music storage  
- ⚡ Real-time Updates – Live features using Socket.io  
- 📁 File Uploads – Upload and manage songs  
- 🎼 Song Metadata – Title, artist, genre, duration, cover art  
- 🎨 Modern UI – Glass-morphism design  

## 🛠️ Tech Stack

- Backend: Node.js (Vanilla)  
- Database: MongoDB Atlas  
- Authentication: JWT (jsonwebtoken)  
- Real-time: Socket.io  
- File Uploads: Multer  
- Security: bcryptjs  
- Environment Config: dotenv  


## 📂 Project Structure

```
.
├── server.js
├── musicapplication.js
├── music.js
├── addSongs.js
├── insertSongs.js
├── test.js
├── fsd_exp1.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

- Node.js (v14+)  
- MongoDB Atlas account  
- npm or yarn  

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Dharshini-cloud/MelodyStream-Web-App.git
cd MelodyStream-Web-App
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env
```

Update `.env` file:
```
MONGO_URL=your_mongodb_connection_string
DB_NAME=musicDB
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
```
## ▶️ Usage

### Start server
```bash
npm start
```

### Development mode
```bash
npx nodemon server.js
```

### Add songs
```bash
node addSongs.js
```

### Insert songs
```bash
node insertSongs.js
```

### Test MongoDB connection
```bash
node test.js
```

## 🗄️ Database Schema

### Songs Collection (mysongs)
```json
{
  "title": "String",
  "artist": "String",
  "url": "String",
  "cover": "String",
  "duration": "String",
  "genre": "String"
}
```

## 🔗 API Endpoints (Sample)

- POST /api/auth/register  
- POST /api/auth/login  
- GET /api/songs  
- POST /api/songs/upload  

## 🔐 Security Notes

- Never commit `.env` file  
- Use strong MongoDB credentials  
- Enable IP whitelist in MongoDB Atlas  
- Use HTTPS in production  

## 🤝 Contributing

1. Fork the repository  
2. Create a branch (git checkout -b feature/new-feature)  
3. Commit changes (git commit -m 'Added feature')  
4. Push (git push origin feature/new-feature)  
5. Open a Pull Request  

## 👩‍💻 Author

Dharshini Venkatesh  
https://github.com/Dharshini-cloud
