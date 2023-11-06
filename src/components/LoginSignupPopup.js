import React, { useState } from "react";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../firebase";
import "./CenteredLoginSignupPopup.css";

const LoginSignupPopup = ({ onClose, onUserChange }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleAuthAttempt = async (e) => {
        e.preventDefault();

        if (!email || !password || (!isLogin && !confirmPassword)) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                if (password !== confirmPassword) {
                    alert("Passwords do not match.");
                    return;
                }
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Account created successfully.");
            }

            const currentUser = auth.currentUser;
            onUserChange(currentUser); // Pass the currentUser to the parent component
            onClose(onUserChange);
        } catch (error) {
            console.error("Authentication error:", error.message);
            alert("Authentication error. Check your credentials.");
        }
    };

    return (
        <div className="popup-container">
            <h1 className="box-title">{isLogin ? "Login" : "Signup"}</h1>
            <form onSubmit={handleAuthAttempt} className="form">
                <div className="form-group">
                    <label className="label">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field email"
                    />
                </div>
                <div className="form-group">
                    <label className="label">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field password"
                    />
                </div>
                {!isLogin && (
                    <div className="form-group">
                        <label className="label">Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field confirm"
                        />
                    </div>
                )}
                <button className="btn submit" type="submit">
                    {isLogin ? "Login" : "Signup"}
                </button>
                <button className="btn switch" type="button" onClick={() => setIsLogin(!isLogin)}>
                    Switch to {isLogin ? "Signup" : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginSignupPopup;
