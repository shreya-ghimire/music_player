# MERN Stack Music Player

This project is a Music Player application built using the MERN stack (MongoDB, Express, React, Node.js).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- User authentication and authorization
- Upload and manage music files
- Play, pause, and skip tracks
- Create and manage playlists
- Like on tracks

## Tech Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Setup Instructions

### Prerequisites

- Node.js (v14 or above)
- npm or yarn
- MongoDB

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/yourusername/mern-music-player.git
    cd mern-music-player
    ```

2. **Backend Setup:**

    - Navigate to the backend directory:
    
      ```sh
      cd backend
      ```
    
    - Install backend dependencies:
    
      ```sh
      npm install
      ```
    
    - Create a `.env` file in the backend directory and add your database configuration and other environment variables:
    
      ```
      MONGO_URI=your_mongodb_uri
      JWT_SECRET=your_jwt_secret
      PORT=your_port
      ```
    
    - Start the backend server:
    
      ```sh
      npm start
      ```

3. **Frontend Setup:**

    - Navigate to the frontend directory:
    
      ```sh
      cd ../frontend
      ```
    
    - Install frontend dependencies:
    
      ```sh
      npm install
      ```
    
    - Start the frontend development server:
    
      ```sh
      npm start
      ```

    The application should now be running and accessible at `http://localhost:3000`.



![Screenshot 2024-05-20 152940](https://github.com/shreya-ghimire/music_player/assets/140148528/06e077ba-64d0-41c1-9a9d-040927f9474f)
![Screenshot 2024-05-20 153054](https://github.com/shreya-ghimire/music_player/assets/140148528/fe72b2f5-cb23-4bde-be97-b49743f7e126)

