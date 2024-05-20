// src/components/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${username}`);
      const user = response.data;

      if (user && user.password === password) {
        setUser(username);
        alert('Login successful!');
        navigate('/home');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className='login'>
     <div className="form-container">
      <div className="form-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
    </div>
  );
}

export default Login;
