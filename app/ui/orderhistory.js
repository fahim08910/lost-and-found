"use client"
import React, { useState, useEffect } from 'react';
import { getOrderHistoryByEmail } from '../actions/orderHistory';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const email = localStorage.getItem('currentUserEmail');
      if (email) {
        setLoading(true);
        try {
          const orderHistory = await getOrderHistoryByEmail(email);
          setOrders(orderHistory);
        } catch (e) {
          setError('Failed to fetch orders. Please try again later.');
        }
        setLoading(false);
      } else {
        setError('Please log in to view your order history.');
      }
    };

    fetchOrders();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Order History</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div style={styles.error}>{error}</div>}
          {orders.length === 0 && !error && <div style={styles.notFound}>No orders found for this email.</div>}
          {orders.map((order, orderIdx) => (
            <div key={orderIdx} style={styles.orderContainer}>
              <div style={styles.orderHeader}>
                Order ID: {order.id} 
                <br />
                Date: {new Date(order.orderDate).toLocaleDateString()} at {formatTime(order.orderDate)}
                <br />
                Delivery Address: {order.deliveryAddress}
              </div>
              <div style={styles.orderContent}>
                <strong>Total Price:</strong> £{
                  (typeof order.totalOrderPrice === 'number'
                    ? order.totalOrderPrice
                    : parseFloat(order.totalOrderPrice || 0)).toFixed(2)
                }
              </div>
              <ul>
                {order.items.map((item, itemIdx) => (
                  <li key={itemIdx} style={styles.item}>
                    <strong>Name:</strong> {item.name}, <strong>Quantity:</strong> {item.quantity}, <strong>Price:</strong> {item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '700px',
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    border: '1px solid #e1e1e1',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '4px'
  },
  input: {
    width: '100%',
    padding: '10px 15px',
    margin: '0 0 20px 0',
    borderRadius: '4px',
    border: '1px solid #d1d1d1',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '10px 15px',
    margin: '0 0 20px 0',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#5cb85c',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px'
  },
  orderContainer: {
    padding: '15px',
    borderRadius: '4px',
    backgroundColor: '#f7f7f7',
    border: '1px solid #e1e1e1',
    marginBottom: '10px'
  },
  orderHeader: {
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '10px'
  },
  orderContent: {
    margin: '0',
    padding: '0',
    fontSize: '16px'
  },
  item: {
    borderBottom: '1px solid #e1e1e1',
    padding: '10px 0',
    listStyleType: 'none'
  },
  error: {
    color: 'red',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ff0000',
    backgroundColor: '#ffecec',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px'
  },
  notFound: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ff0000',
    backgroundColor: '#ffecec',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px'
  }
};

export default OrderHistory;

