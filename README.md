# Music App 🎵

A Node.js music player application with MongoDB Atlas integration, authentication, and real-time features.

## Features

✅ **Music Playback** - Play Tamil and English songs  
✅ **MongoDB Integration** - Cloud-based song storage and management  
✅ **User Authentication** - JWT-based secure authentication  
✅ **Real-time Updates** - Socket.io support for live features  
✅ **File Management** - Upload and manage music files  
✅ **Song Metadata** - Title, artist, duration, genre, cover art  

## Project Structure

```
├── server.js              # Main server with MongoDB Atlas
├── musicapplication.js    # Full-featured music app
├── music.js              # Basic HTML player interface
├── addSongs.js           # Utility to add songs to DB
├── insertSongs.js        # Utility to insert songs to DB
├── test.js               # MongoDB connection test
├── fsd_exp1.js           # Alternative server implementation
├── package.json          # Dependencies
├── .env.example          # Environment template
└── .gitignore            # Git ignore rules
```

## Prerequisites

- Node.js (v14+)
- MongoDB Atlas account
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/music-app.git
   cd music-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your credentials**
   ```
   MONGO_URL=mongodb+srv://username:password@cluster0.nscyi.mongodb.net/musicDB?retryWrites=true&w=majority
   DB_NAME=musicDB
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   ```

## Usage

### Start the server
```bash
npm start
```

### Run the server with auto-reload (dev mode)
```bash
npx nodemon server.js
```

### Add songs to database
```bash
node addSongs.js
```

### Insert songs to database
```bash
node insertSongs.js
```

### Test MongoDB connection
```bash
node test.js
```

## MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to `.env` as `MONGO_URL`

## Database Schema

### Songs Collection (mysongs)
```javascript
{
  title: String,
  artist: String,
  url: String,
  cover: String,
  duration: String,
  genre: String
}
```

## Security Notes

⚠️ **Never commit `.env` file** - Use `.env.example` as template  
⚠️ **Keep MongoDB credentials private** - Use strong passwords  
⚠️ **Enable IP whitelist** in MongoDB Atlas  
⚠️ **Use HTTPS in production** - Enable TLS/SSL  

## Dependencies

- **express** - Web framework
- **mongoose/mongodb** - Database ORM and driver
- **socket.io** - Real-time communication
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin requests
- **multer** - File uploads
- **dotenv** - Environment variables
- **nodemon** - Dev auto-reload

## API Endpoints

(Add your API routes here as you develop)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please create an issue on GitHub.

## Author

Your Name - [GitHub Profile](https://github.com/yourusername)
