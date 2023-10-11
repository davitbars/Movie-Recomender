// Header.js

import React from 'react';
import './Header.css'; // Import the CSS file for styling

function Header() {
  return (
    <header className="header">
      <div className="branding">
        <h1 className="logo">Movie Recommender</h1>
        <p className="slogan">Discover Your Next Favorite Movie</p>
      </div>
      <nav className="navigation">
        <ul className="nav-list">
          <li className="nav-item"><a href="/">Home</a></li>
          <li className='nav-item'><a href='/picker'>Movie Picker</a></li>
          <li className="nav-item"><a href="/about">About</a></li>
          <li className="nav-item"><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
