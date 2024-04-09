"use client"
import React, { useState } from 'react';
import { updateProduct } from '../actions/updateProduct';

const UpdateProductComponent = () => {
  const [productId, setProductId] = useState('');
  const [name, setName] = useState(''); 
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!productId || !name || !description || !type || !manufacturer || !quantity || !price) {
      setMessage({ text: 'All fields are required.', isError: true });
      return;
    }

    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);

    if (isNaN(numericQuantity) || isNaN(numericPrice) || numericQuantity < 1 || numericPrice < 1) {
      setMessage({ text: 'Quantity and price must be positive numbers.', isError: true });
      return;
    }

    const updateData = {
      name,
      description,
      type,
      manufacturer,
      quantity: numericQuantity,
      price: `£${numericPrice.toFixed(2)}`
    };

    const response = await updateProduct(productId, updateData);
    setMessage({ text: response.message, isError: !response.success });
  };

  const getMessageStyle = () => ({
    margin: '10px 0',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: message.isError ? '#f8d7da' : '#d4edda',
    color: message.isError ? '#721c24' : '#155724',
  });

  return (
    <div style={styles.container}>
      <h2>Update Product</h2>
      {message.text && <p style={getMessageStyle()}>{message.text}</p>}
      <form onSubmit={handleUpdate} style={styles.form}>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Product ID"
          style={styles.input}
          required
        />
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
          style={styles.select}
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
          style={styles.select}
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
          min="0.01"
          step="0.01"
          required
        />
        <button type="submit" style={styles.button}>Update Product</button>
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
  }
};

export default UpdateProductComponent;
