import React, { useState } from "react";
import { createNewUser, logInUser } from "../requests/Requests";
import { useNavigate } from "react-router-dom";
import './LoginBox.css';

const SUCCESS = 200;

export default function LoginBox() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [newUser, setNewUser] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const navigate = useNavigate();

    function handleSubmit() {
        if (newUser === true) {
            createNewUser(username, password).then((response) => {
                if (response === SUCCESS) {
                    setHasError(false);
                    navigate('/tasks');
                } else {
                    setHasError(true);
                }
            });
        } else {
            logInUser(username, password).then((response) => {
                if (response === SUCCESS) {
                    setHasError(false);
                    navigate('/tasks');
                } else {
                    setHasError(true);
                }
            });
        }
    }
    
    return (
        <div className="login-container">
            <h1>Task Manager</h1>
            <div className="login-box">
                <div className="user-name">
                    <label>Username</label>
                    <input type="text" onChange={(event) => setUsername(event?.target.value)} value={username} />
                </div>
                <div className="password">
                    <label>Password</label>
                    <input type="password" onChange={(event) => setPassword(event?.target.value)} value={password} />
                </div>
                <div className="new-user-checkbox">
                    <label>New User</label>
                    <input type="checkbox" onChange={() => setNewUser(!newUser)} value={newUser.toString()} />
                </div>
                <div className="submit-button">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
                {hasError &&
                    <div className="error-message">
                        Invalid login, please try again.
                    </div>
                }
                </div>
            </div>
    );  
};