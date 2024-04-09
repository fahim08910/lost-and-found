"use client"
import React, { useEffect, useState } from 'react';
import { getAllItems } from '../actions/allItems';

const AllItemsComponent = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const response = await getAllItems();
      if (response.success) {
        setItems(response.items);
      } else {
        setError(response.error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.itemsContainer}>
        {items.map((item) => (
          <div key={item.id} style={styles.itemCard}>
            <div style={styles.itemHeader}>
              <h3 style={styles.itemTitle}>{item.name}</h3>
            </div>
            <div style={styles.itemBody}>
              <p style={styles.itemID}><strong>ID:</strong> {item.id}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Manufacturer:</strong> {item.manufacturer}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> {item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    minHeight: '100vh', 
    margin: '0',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    width: '100%',
  },
  itemCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  itemHeader: {
    backgroundColor: '#f7f7f7',
    padding: '10px 15px',
    borderBottom: '1px solid #ddd',
  },
  itemTitle: {
    margin: '0',
    color: '#333',
    fontSize: '18px',
  },
  itemBody: {
    padding: '15px',
    textAlign: 'left',
    lineHeight: '1.6',
  },
  itemID: {
    wordBreak: 'break-all', 
  },
  error: {
    color: '#ff0000',
    textAlign: 'center',
    width: '100%',
    marginBottom: '20px',
  }
};

export default AllItemsComponent;
