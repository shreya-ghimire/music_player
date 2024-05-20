const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://socialfitness:asdf@cluster0.wqzmyib.mongodb.net/music', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.use(cors());
app.use(bodyParser.json());

const songSchema = new mongoose.Schema({
  songId: { type: Number, required: true },
  name: { type: String, required: true },
  artist: { type: String, required: true },
  img: { type: String, required: true },
  audio: { type: String, required: true },
  category: { type: String, required: true },
  liked: { type: Number, default: false },
});

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  songIds: [{ type: Number, ref: 'Song' }],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  playlists: [playlistSchema], 
});

const Song = mongoose.model('Song', songSchema);
const User = mongoose.model('User', userSchema);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});
const upload = multer({ storage: storage });
app.post('/api/songs', upload.single('audio'), async (req, res) => {
  const { name, artist, img, category } = req.body;
  const audio = req.file ? req.file.filename : null;

  if (!audio) {
    return res.status(400).json({ message: 'Audio file is required' });
  }

  try {
    // Fetch the latest song from the database to get the last songId
    const lastSong = await Song.findOne().sort({ songId: -1 });

    // Generate the new songId by incrementing the last songId by 1
    const songId = lastSong ? lastSong.songId + 1 : 1;

    const newSong = new Song({
      songId,
      name,
      artist,
      img,
      audio: `/uploads/${audio}`,
      category,
    });

    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get all songs
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate('likedSongs').populate('playlists.songIds');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: 'Error adding user' });
  }
});


// Like a song
app.post('/api/songs/:id/like', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
    const song = await Song.findOne({ songId: id });
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    song.likes += 1;
    await song.save();

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.likedSongs.includes(song._id)) {
      user.likedSongs.push(song._id);
      await user.save();
    }

    res.status(200).json({ message: 'Song liked successfully' });
  } catch (error) {
    console.error('Error liking song:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/users/:username/liked-songs', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).populate('likedSongs');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.likedSongs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching liked songs' });
  }
});


// Create a new playlist or add a song to an existing playlist
// POST endpoint to add a song to a playlist for a specific user
app.post('/api/users/:username/playlists', async (req, res) => {
  const { username } = req.params;
  const { playlistName, songIds } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the playlist already exists
    const existingPlaylist = user.playlists.find(playlist => playlist.name === playlistName);
    if (existingPlaylist) {
      return res.status(400).json({ message: 'Playlist already exists' });
    }

    // Create a new playlist with the provided name and songIds array
    const playlist = { name: playlistName, songIds: songIds || [] };
    user.playlists.push(playlist);
    await user.save();

    res.status(201).json(playlist); // Return the newly created playlist
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// GET playlists for a specific user
app.get('/api/users/:username/playlists', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the playlists for the user
    res.json(user.playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST endpoint to add a song to a playlist for a specific user
app.post('/api/users/:username/playlists/:playlistId/add-song', async (req, res) => {
  const { username, playlistId } = req.params;
  const { songId } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const playlist = user.playlists.find(p => p.name === playlistId);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.songIds.push(songId);
    await user.save();

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
