"use client"
import React, { useState } from 'react';
import { updateUser } from '../actions/updateUser';

const UpdateUserComponent = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('regular');
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!userId || !email || !name) {
      setMessage({ text: 'ID, email, and name are required.', isError: true });
      return;
    }

    const updateData = { email, name, role };

    const response = await updateUser(userId, updateData);
    setMessage({ text: response.message, isError: !response.success });
  };

  

  return (
    <div style={styles.container}>
      <h2>Update User</h2>
      {message.text && <p style={styles.getMessageStyle(message.isError)}>{message.text}</p>}
      <form onSubmit={handleUpdate} style={styles.form}>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
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
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
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
        <button type="submit" style={styles.button}>Update User</button>
      </form>
    </div>
  );
};
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
    select: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
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
    getMessageStyle: (isError) => ({
      margin: '10px 0',
      padding: '10px',
      borderRadius: '4px',
      backgroundColor: isError ? '#f8d7da' : '#d4edda',
      color: isError ? '#721c24' : '#155724',
    }),
  };
  
  
export default UpdateUserComponent;
