"use client"
import React, { useState, useEffect } from 'react';
import { searchItems } from '../actions/userSearch';

const UserSearchComponent = () => {
  const [type, setType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [items, setItems] = useState([]);
  const [basketItems, setBasketItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      setBasketItems(JSON.parse(savedBasket).map(item => item.id));
    }
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    const response = await searchItems({ type, manufacturer });
    if (response.success) {
      setItems(response.items);
      setErrorMessage('');
    } else {
      setItems([]);
      setErrorMessage(response.error);
    }
  };

  const handleAddToBasket = (item) => {
    const currentBasket = JSON.parse(localStorage.getItem('basket')) || [];
    const updatedBasket = [...currentBasket, item];
    localStorage.setItem('basket', JSON.stringify(updatedBasket));
    setBasketItems(prev => [...prev, item.id]);
  };

  const gridContainerStyle = items.length > 0 ? styles.gridContainer : {...styles.gridContainer, ...styles.noProducts};
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>welcome to Solent E-Stores</h1>
      <h2 style={{ textAlign: 'center' }}>Search for Products</h2>
      <form onSubmit={handleSearch} style={styles.form}>
        <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
          <option value="">Select Type</option>
          <option value="Apparel">Apparel</option>
          <option value="Stationery">Stationery</option>
          <option value="Electronics">Electronics</option>
        </select>
        <select value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} style={styles.select}>
          <option value="">Select Manufacturer</option>
          <option value="Techwise">Techwise</option>
          <option value="StudyPro">StudyPro</option>
          <option value="Solent Gear">Solent Gear</option>
        </select>
        <button type="submit" style={styles.searchButton}>Search</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      <div style={items.length > 0 ? styles.gridContainer : { ...styles.gridContainer, ...styles.noProducts }}>
        {items.map((item) => (
          <div key={item.id} style={styles.card}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Type: {item.type}</p>
            <p>Manufacturer: {item.manufacturer}</p>
            <p>Price: {item.price}</p>
            <button
              onClick={() => handleAddToBasket(item)}
              disabled={basketItems.includes(item.id)}
              style={styles.button(basketItems.includes(item.id))}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
};
const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginTop: '15px',
  },
  noProducts: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '10vh',
    width: '100%',
    textAlign: 'center',
    margin: '0',
    padding: '0',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgb(210, 210, 210)',
    marginTop: '20px',
    
  },
  button: (isInBasket) => ({
    padding: '10px 20px',
    marginTop: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: isInBasket ? 'grey' : 'blue',
    color: 'white',
    border: 'none',
  }),
  form: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    width: '150px',
  },
  searchButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    width: '120px', 
  },
  
};
export default UserSearchComponent;
