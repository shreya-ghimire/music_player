import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import Navbar from './Navbar';

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const getSongById = (songId) => {
    return songs.find(song => song.songId === songId);
  };
  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user}/playlists`);
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchAllSongs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/songs');
      setSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      // Create a new playlist with an empty array of songIds
      await axios.post(`http://localhost:5000/api/users/${user}/playlists`, { playlistName, songIds: [] });
      setPlaylistName('');
      fetchPlaylists(); // Refresh the playlists
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <div className="playlists">
      <Navbar />
      <h2>Playlists</h2>
      <div className="create-playlist">
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="New Playlist Name"
        />
        <button onClick={handleCreatePlaylist}>Create Playlist</button>
      </div>
      <div className="playlist-list">
        {playlists.map(playlist => (
          <div key={playlist._id} className="playlist-card">
            <h3>{playlist.name}</h3>
            <ul>
            {playlist.songIds.map(songId => {
                const song = getSongById(songId);
                return song ? (
                  <li key={song._id}>
                    <img src={song.img} alt={song.name} width="50" />
                    <div>
                      <h4>{song.name}</h4>
                      <p>{song.artist}</p>
                      <audio controls>
                        <source src={song.audioFile} type="audio/mp3" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </li>
                ) : (
                  <li key={songId}>Loading...</li>
                );
              })}
            </ul>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Playlist;
