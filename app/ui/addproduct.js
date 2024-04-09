"use client"
import React, { useState } from 'react';
import { addProduct } from '../actions/addProduct';

const AddProductComponent = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);
    if (!name || !description || !type || !manufacturer || isNaN(numericQuantity) || isNaN(numericPrice) || numericQuantity <= 0 || numericPrice <= 0) {
      setMessage({ text: 'All fields are required and quantity/price must be positive numbers.', isError: true });
      return;
    }

    const productData = {
      name,
      description,
      type,
      manufacturer,
      quantity: numericQuantity,
      price: `£${numericPrice.toFixed(2)}`
    };

    const response = await addProduct(productData);
    setMessage({ text: response.message, isError: !response.success });
  };


  return (
    <div style={styles.container}>
      <h2>Add New Product</h2>
      {message.text && <p style={styles.message}>{message.text}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          style={styles.input}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={styles.input}
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={styles.input}
          required
        >
          <option value="">Select Type</option>
          <option value="Apparel">Apparel</option>
          <option value="Stationery">Stationery</option>
          <option value="Electronics">Electronics</option>
        </select>
        <select
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          style={styles.input}
          required
        >
          <option value="">Select Manufacturer</option>
          <option value="Techwise">Techwise</option>
          <option value="StudyPro">StudyPro</option>
          <option value="Solent Gear">Solent Gear</option>
        </select>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          style={styles.input}
          min="1"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          style={styles.input}
          min="1"
          step="0.05"
          required
        />
        <button type="submit" style={styles.button}>Add Product</button>
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

export default AddProductComponent;