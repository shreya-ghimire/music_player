import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import Navbar from './Navbar';

function Home() {
  const [songs, setSongs] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    img: '',
    category: '',
    audio: null
  });

  useEffect(() => {
    fetchSongs();
    fetchUserPlaylists();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/songs');
      setSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const fetchUserPlaylists = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user}/playlists`);
      setUserPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/songs/${id}/like`, { username: user });
      fetchSongs();
    } catch (error) {
      console.error('Error liking song:', error);
    }
  };

  const handleAddToPlaylist = async (songId, playlistId) => {
    try {
      await axios.post(`http://localhost:5000/api/users/${user}/playlists/${playlistId}/add-song`, { songId });
      fetchSongs();
    } catch (error) {
      console.error('Error adding to playlist:', error);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, audio: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    try {
      await axios.post('http://localhost:5000/api/songs', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowForm(false);
      fetchSongs();
    } catch (error) {
      console.error('Error uploading song:', error);
    }
  };

  return (
    <div className="home">
      <Navbar />
      <br />
      <button onClick={() => setShowForm(!showForm)} className="song-like-button">Add songs</button>
      <br />
      {showForm && (
        <form onSubmit={handleSubmit} className="upload-form">
          <input type="text" name="name" placeholder="Song Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="artist" placeholder="Artist" value={formData.artist} onChange={handleChange} required />
          <input type="text" name="img" placeholder="Image URL" value={formData.img} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <input type="file" name="audio" onChange={handleFileChange} required />
          <button type="submit">Upload Song</button>
        </form>
      )}
      <div className="song-list">
        {songs.map(song => (
          <div key={song._id} className="song-card">
            <img src={song.img} alt={song.name} className="song-image" />
            <h3 className="song-title">{song.name}</h3>
            <p className="song-artist">{song.artist}</p>
            <audio controls onError={(e) => console.error('Error loading audio:', e)}>
              <source src={`http://localhost:5000/${song.audio}`} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>

            <button onClick={() => handleLike(song.songId)} className="song-like-button">
              Like
            </button>
            <select onChange={(e) => handleAddToPlaylist(song.songId, e.target.value)} className="song-playlist-select">
              <option value="">Add to Playlist</option>
              {userPlaylists.map(playlist => (
                <option key={playlist.name} value={playlist.name}>{playlist.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
