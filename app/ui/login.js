import React, { useState, useEffect } from 'react';
import logInAction from '../actions/logIn';
import logOut from '../actions/logOut';
import Link from 'next/link';

const LoginForm = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const persistedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const persistedEmail = localStorage.getItem('currentUserEmail');
        const persistedUserRole = localStorage.getItem('userRole');
        const persistedLoginMessage = localStorage.getItem('loginMessage');

        if (persistedIsLoggedIn && persistedLoginMessage) {
            setIsLoggedIn(true);
            setCurrentUserEmail(persistedEmail);
            setUserRole(persistedUserRole);
            setLoginMessage(persistedLoginMessage);
            initiateLogoutTimer();
        }
    }, []);

    const initiateLogoutTimer = () => {
        setTimeout(() => {
            handleLogout();
        }, 1200000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = { email, password };
        const result = await logInAction(formData);
    
        if (result.status === "LoggedIn") {
            // Perform state updates and localStorage operations
            setIsLoggedIn(true);
            setCurrentUserEmail(result.user);
            setUserRole(result.role);
            onLoginSuccess(); // Assuming this doesn't redirect or change state that makes the reload unnecessary
            
            // Save to localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUserEmail', result.user);
            localStorage.setItem('userRole', result.role);
            initiateLogoutTimer();
    
            // Refresh the page
            window.location.reload();
        } else {
            setLoginMessage(result.message);
        }
    };
    

    const handleLogout = async () => {
        await logOut(); // Perform the logout operation
        // Clear state and localStorage as you're already doing
        setIsLoggedIn(false);
        setCurrentUserEmail('');
        setUserRole(null);
        setLoginMessage('');
        setUserName('');
        localStorage.clear();
    
        // Refresh the page
        window.location.reload();
    };
    
    

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Login</h2>
            {!isLoggedIn && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>
                        Email:
                        <input 
                            type='email' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.label}>
                        Password:
                        <input 
                            type='password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={styles.input}
                        />
                    </label>
                    <button type="submit" style={styles.button}>Login</button>
                </form>
            )}
            <div style={styles.message}>{loginMessage}</div>
            {isLoggedIn && (
                <div style={styles.userInfo}>
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                    {userRole === 'admin' && (
                        <div>
                           <Link href="/solent/admin" style={styles.adminButton}>Visit Admin Page</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
const styles = {
    container: {
        width: '300px',
        margin: 'auto',
        marginTop: '10px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px 0px #00000033'
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '10px'
    },
    input: {
        width: 'calc(100% - 20px)',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px'
    },
    button: {
        width: '100%',
        padding: '10px 20px',
        backgroundColor: '#005a9c',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    },
    buttonHover: {
        backgroundColor: '#003d73'
    },
    adminLink: {
        marginTop: '20px',
        display: 'block',
        textAlign: 'center'
    },
    adminButton: {
        display: 'inline-block',
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#4CAF50', 
        color: 'white',
        textAlign: 'center',
        textDecoration: 'none',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    }
};
export default LoginForm; 
