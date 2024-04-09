"use client"
import React, { useState } from 'react';
import { deleteProduct } from '../actions/productDelete';

const DeleteProductComponent = () => {
  const [productId, setProductId] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await deleteProduct(productId);
    if (response.success) {
      setMessage('Product deleted successfully.');
      setProductId('');
    } else {
      setMessage(`Error deleting product: ${response.error}`);
    }
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
      backgroundColor: message.startsWith('Error') ? '#f2dede' : '#dff0d8',
      color: message.startsWith('Error') ? '#a94442' : '#3c763d',
    }
  };

  return (
    <div style={styles.container}>
      <h2>Delete Product</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleDelete} style={styles.form}>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Enter Product ID"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Delete Product</button>
      </form>
    </div>
  );
};

export default DeleteProductComponent;
