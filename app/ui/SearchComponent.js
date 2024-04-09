"use client"
import React, { useState } from 'react';
import { searchItems } from '../actions/Search';

const SearchComponent = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');
    const response = await searchItems({ name, type, manufacturer });

    if (response.success) {
      setItems(response.items);
    } else {
      setError(response.error);
      setItems([]);
    }
  };

  return (
    <div style={styles.searchContainer}>
      {error && <div style={styles.errorMessage}>{error}</div>}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <div style={styles.searchBar}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search by name"
            style={styles.input}
          />
          <select value={type} onChange={(e) => setType(e.target.value)} style={styles.dropdown}>
            <option value="">Select Type</option>
            <option value="Apparel">Apparel</option>
            <option value="Stationery">Stationery</option>
            <option value="Electronics">Electronics</option>
          </select>
          <select value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} style={styles.dropdown}>
            <option value="">Select Manufacturer</option>
            <option value="Techwise">Techwise</option>
            <option value="StudyPro">StudyPro</option>
            <option value="Solent Gear">Solent Gear</option>
          </select>
          <button type="submit" style={styles.searchButton}>Search</button>
        </div>
      </form>
      <div style={styles.resultsContainer}>
        {items.map((item) => (
          <div key={item.id} style={styles.resultItem}>
            <p>ID: {item.id}</p>
            <p>Name: {item.name}</p>
            <p>Description: {item.description}</p>
            <p>Type: {item.type}</p>
            <p>Manufacturer: {item.manufacturer}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  searchContainer: {
    maxWidth: '1000px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  errorMessage: {
    backgroundColor: '#ffcccc',
    color: '#333',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  searchForm: {
    display: 'flex',
    justifyContent: 'center',
  },
  searchBar: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  input: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    maxWidth: '350px', 
    flex: '1', 
  },
  dropdown: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    backgroundColor: '#f8f8f8',
    width: '200px', 
  },
  searchButton: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '150px',
  },
  resultsContainer: {
    marginTop: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  resultItem: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default SearchComponent;


