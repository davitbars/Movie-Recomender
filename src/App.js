import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Import the Header component
import Home from './components/Home';
import MovieDetail from './components/MovieDetail'; // Import the MovieDetail component
import About from './components/About';
import Contact from './components/Contact';
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
            <Route path="/movie/:movieId" element={<MovieDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
