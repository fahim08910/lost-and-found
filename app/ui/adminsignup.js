"use client"
import React, { useState } from 'react';
import { signUp } from '../actions/adminSignUp';

const AdminSignupComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('regular');
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const getMessageStyle = (isError) => ({
    margin: '10px 0',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: isError ? '#f8d7da' : '#d4edda',
    color: isError ? '#721c24' : '#155724',
  });

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: '#f7f7f7',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    button: {
      padding: '10px 15px',
      fontSize: '16px',
      borderRadius: '4px',
      backgroundColor: '#5cb85c',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    },
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');
    const response = await signUp(name, email, password, role);
    if (response.user) {
      console.log('Admin Signup successful!', response.user);
      setSignupSuccess(true);
    } else {
      console.error('Admin Signup error:', response.error);
      setError(response.error);
      setSignupSuccess(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Sign Up</h2>
      {signupSuccess && <div style={getMessageStyle(false)}>Signup successful!</div>}
      {error && <div style={getMessageStyle(true)}>Error: {error}</div>}
      <form onSubmit={handleSignup} style={styles.form}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          required 
          style={styles.input} 
        />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
          style={styles.input} 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
          style={styles.input} 
        />
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          style={styles.input} 
          required
        >
          <option value="regular">Regular</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

export default AdminSignupComponent;
