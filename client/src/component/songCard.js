// src/components/SongCard.js
import React, { useState } from 'react';

function SongCard({ song, onLike, playlists, onAddToPlaylist }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  const handleAddToPlaylist = () => {
    if (selectedPlaylist) {
      onAddToPlaylist(song.songId, selectedPlaylist);
    }
  };

  return (
    <div className="song-card">
      <img src={song.img} alt={song.name} />
      <h3>{song.name}</h3>
      <p>{song.artist}</p>
      <p>{song.category}</p>
      <audio controls>
        <source src={song.audioFile} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={() => onLike(song.songId)}>Like ({song.likes})</button>
      <div>
        <select onChange={(e) => setSelectedPlaylist(e.target.value)} value={selectedPlaylist}>
          <option value="">Add to Playlist</option>
          {playlists.map(playlist => (
            <option key={playlist._id} value={playlist._id}>{playlist.name}</option>
          ))}
        </select>
        <button onClick={handleAddToPlaylist}>Add</button>
      </div>
    </div>
  );
}

export default SongCard;
