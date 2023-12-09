// To run the server stuff go to this path in the cmd: PS C:\Users\davit\OneDrive\Desktop\Movie recommendations\FlaskAPI>
// and then type "python app.py"

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Import the Header component
import Home from './components/Home';
import MovieDetail from './components/MovieDetail'; // Import the MovieDetail component
import About from './components/About';
import Contact from './components/Contact';
import MoviePicker from './components/MoviePicker';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/picker" element={<MoviePicker />} />
            <Route path="/movie/:movieTitle" element={<MovieDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
