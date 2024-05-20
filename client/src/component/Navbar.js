import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Music Player</h1>
      </div>
      <ul className="navbar-right">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/liked">Liked Songs</Link></li>
        <li><Link to="/playlists">Playlists</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
