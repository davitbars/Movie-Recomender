import React from 'react';
import './CenteredLoginSignupPopup.css'; // Import the CSS file for styling
import LoginSignupPopup from './LoginSignupPopup'; // Import your existing login/signup popup component
import { FaTimes } from 'react-icons/fa';

function CenteredLoginSignupPopup({ isOpen, onClose }) {
    return isOpen ? (
        <div className="centered-popup-overlay">
            <div className="centered-popup">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <LoginSignupPopup onClose={onClose} />
            </div>
        </div>
    ) : null;
}

export default CenteredLoginSignupPopup;
