/*
import "./solent.css";
import Link from 'next/link';

function Layout({children}) {
    return(
        <div id='container'>
        <div id='nav'>
        <Link href='/solent'>Home</Link>
        <br />
        <Link href='/solent/basket'>Basket</Link>
        <br />
        <Link href='/solent/history'>Order History</Link>
        <br />
        <Link href='/solent/login'>Login</Link>
        <br />
        <Link href='/solent/Lostpost'>Lost Post</Link>
        <br />
        <Link href='/solent/viewpost'>View Lost Post</Link>
        <br />
        <Link href='/solent/chat'>Chat</Link>
        <br />
        <Link href='/solent/save'>Save</Link>
        <br />
        </div>
        <div id='main'>
        {children}
        </div>
        </div>
    );
}

export default Layout;
*/
"use client"
import React, { useState, useEffect } from 'react';
import logOut from '../actions/logOut'; // assuming this exists and works like in LoginForm
import "./solent.css";
import Link from 'next/link';

function Layout({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const clearSession = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setShowDropdown(false);
    };

    const handleLogout = async () => {
        await logOut();
        clearSession();
        window.location.reload();
    };

    useEffect(() => {
        const persistedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (persistedIsLoggedIn) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            const logoutTimer = setTimeout(() => {
                handleLogout();
            }, 1200000);

            return () => clearTimeout(logoutTimer);
        }
    }, [isLoggedIn]);

    // Use onMouseEnter and onMouseLeave to handle dropdown visibility
    const toggleDropdown = (state) => {
        setShowDropdown(state);
    };
    
    return (
        <div id='container'>
            <div id='nav'>
                <Link href='/solent'>Home</Link>
                <br />
                <Link href='/solent/basket'>Basket</Link>
                <br />
                <Link href='/solent/history'>Order History</Link>
                <br />
                {isLoggedIn ? (
                    <div className="profile-container" 
                        onMouseEnter={() => toggleDropdown(true)}
                        onMouseLeave={() => toggleDropdown(false)}>
                        <a>Profile &#x25BC;</a>
                        <div className={`dropdown-content ${showDropdown ? 'show-dropdown' : ''}`}>
                            <Link href='/solent/edit'>Edit</Link><br />
                            <Link href='/solent/save'>Save Post</Link><br />
                            <a onClick={handleLogout}>Logout</a>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link href='/solent/login'>Login</Link>
                        <br />
                    </>
                )}
                <Link href='/solent/Lostpost'>Lost Post</Link>
                <br />
                <Link href='/solent/viewpost'>View Lost Post</Link>
                <br />
                <Link href='/solent/chat'>Chat</Link>
                <br />
                <Link href='/solent/save'>Save</Link>
                <br />
            </div>
            <div id='main'>
                {children}
            </div>
        </div>
    );
}

export default Layout;
