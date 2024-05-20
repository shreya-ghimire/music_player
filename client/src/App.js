import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import Home from './component/Home';
import Login from './component/Login';
import Signup from './component/Signup';
import LikedSongs from './component/Liked';
import Playlist from './component/Playlist';
import './App.css'

function App() {
  return (
    <>
     
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/liked" element={<LikedSongs />} />
        <Route path="/playlists" element={<Playlist />} />
      </Routes>
    </>
  );
}

export default App;
