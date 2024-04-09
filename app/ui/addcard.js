"use client"
import React, { useState } from 'react';
import { addCard } from '../actions/addCard';

const AddCardComponent = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });

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
    message: {
      margin: '10px 0',
      padding: '10px',
      borderRadius: '4px',
      backgroundColor: message.isError ? '#f8d7da' : '#d4edda',
      color: message.isError ? '#721c24' : '#155724',
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const numericBalance = Number(balance);
  
    if (cardNumber.length === 16 && cvv.length === 3 && !isNaN(numericBalance) && numericBalance >= 0) {
      const cardData = {
        Balance: numericBalance, 
        CVV: cvv,               
        'Card Number': cardNumber,  
        Name: name              
      };
  
      try {
        const response = await addCard(cardData);
        setMessage({
          text: response.message,
          isError: !response.success
        });
      } catch (error) {
        setMessage({
          text: `Error: ${error.message}`,
          isError: true
        });
      }
    } else {
      setMessage({
        text: 'Please ensure all fields are correct: Card number must be 16 digits, CVV 3 digits, and balance a non-negative number.',
        isError: true
      });
    }
  };
  

  return (
    <div style={styles.container}>
      <h2>Add New Card</h2>
      <div style={styles.message}>{message.text && <p>{message.text}</p>}</div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="Card Number"
          style={styles.input}
          maxLength="16"
          pattern="\d{16}"
          title="Card number must be 16 digits"
          required
        />
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
          style={styles.input}
          maxLength="3"
          pattern="\d{3}"
          title="CVV must be 3 digits"
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name on Card"
          style={styles.input}
          required
        />
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="Balance"
          style={styles.input}
          min="0"
          step="0.01"
          required
        />
        <button type="submit" style={styles.button}>Add Card</button>
      </form>
    </div>
  );
};

export default AddCardComponent;
