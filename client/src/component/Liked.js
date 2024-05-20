import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import Navbar from './Navbar';

function Liked() {
  const [likedSongs, setLikedSongs] = useState([]); 
  const { user } = useContext(UserContext);
  console.log(user);

  useEffect(() => {
    if (user) {
      console.log("Fetching liked songs...");
      fetchLikedSongs();
    }
  }, [user]); 


    const fetchLikedSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${user}/liked-songs`);
        console.log("Liked songs response:", response.data); // Check the response data
        setLikedSongs(response.data); // Set likedSongs directly without accessing .likedSongs property
      } catch (error) {
        console.error('Error fetching liked songs:', error);
      }
    };
    

  if (!user) {
    return <div>Loading...</div>; // or render a different UI indicating loading
  }

  return (
    <div className="liked-songs">
      <Navbar />
      <h2>Liked Songs</h2>
      <div className="song-list">
        {likedSongs.map(song => (
          <div key={song.songId} className="song-card">
           <img src={song.img} alt={song.name} className="song-image" />
            <h3 className="song-title">{song.name}</h3>
            <p className="song-artist">{song.artist}</p>
            <audio controls src={song.audioUrl} className="song-audio">
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Liked;
