import React, { useState, useEffect } from 'react';
import './Header.css';
import { FaUser } from 'react-icons/fa';
import CenteredLoginSignupPopup from './CenteredLoginSignupPopup';

function Header() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(user); // Set the user state based on the authentication status
  }, [user]);

  const openPopup = (event) => {
    if (!user) {
      setPopupOpen(true);
      event.preventDefault(); // Prevent navigation
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleUserChange = (newUser) => {
    // Update the user state when the user's authentication status changes
    setUser(newUser);
    console.log(newUser);
  };

  return (
    <header className="header">
      <div className="branding">
        <h1 className="logo">Movie Recommender</h1>
        <p className="slogan">Discover Your Next Favorite Movie</p>
      </div>
      <nav className="navigation">
        <ul className="nav-list">
          <li className="nav-item"><a href="/">Home</a></li>
          {/* <li className='nav-item'><a href='/picker'>Movie Picker</a></li> */}
          <li className='nav-item'>
            <a href='/picker' onClick={openPopup}>
              Movie Picker
            </a>
          </li>
          <li className="nav-item"><a href="/about">About</a></li>
          <li className="nav-item"><a href="/contact">Contact</a></li>
          <button className="login-button" onClick={openPopup}>
            <FaUser />
          </button>
        </ul>
      </nav>
      <CenteredLoginSignupPopup isOpen={isPopupOpen} onClose={closePopup} user={user} onUserChange={handleUserChange} />
    </header>
  );
}

export default Header;
