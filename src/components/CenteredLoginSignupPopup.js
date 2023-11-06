import React from 'react';
import './CenteredLoginSignupPopup.css';
import LoginSignupPopup from './LoginSignupPopup';
import { FaTimes } from 'react-icons/fa';

function CenteredLoginSignupPopup({ isOpen, onClose, currentUser, onUserChange }) {
    return isOpen ? (
        <div className="centered-popup-overlay">
            <div className="centered-popup">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <LoginSignupPopup onClose={onClose} onUserChange={onUserChange} />
            </div>
        </div>
    ) : null;
}

export default CenteredLoginSignupPopup;
