import React, { useState, useRef, useEffect } from 'react';
import { addOrderDetails } from '../actions/AddOrder'; 
import { getUserDetails, updateUserBalance } from '../actions/checkOut';
import { updateProductQuantity } from '../actions/updateProductQuantity';
const BasketComponent = ({ basket, removeItem, updateQuantity, clearBasket }) => {
  const checkoutFormRef = useRef(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('currentUserEmail');
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn && email) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  };

  const calculateTotalOrderPrice = () => {
    return basket.reduce((total, item) => {
      const price = parsePrice(item.price);
      const quantity = Number(item.buyQuantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const totalOrderPrice = calculateTotalOrderPrice();

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      alert('Please login to proceed.');
      return;
    }
    setShowCheckout(true);
    setTimeout(() => {
      checkoutFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const cardNumber = formData.get('card-details');
    const cvv = formData.get('card-cvv');
    const deliveryAddress = formData.get('delivery-address');
    const email = localStorage.getItem('currentUserEmail');
  
    try {
      const userDetails = await getUserDetails(cardNumber, name, cvv);
      if (userDetails) {
        if (userDetails.Balance >= totalOrderPrice) {
          let allInStock = true;
          for (let item of basket) {
            const isInStock = await updateProductQuantity(item.name, item.buyQuantity);
            if (!isInStock) {
              alert(`Not enough stock for ${item.name}.`);
              allInStock = false;
              break;
            }
          }
  
          if (allInStock) {
            const newBalance = userDetails.Balance - totalOrderPrice;
            await updateUserBalance(userDetails.id, newBalance.toString());
  
            const orderItems = basket.map(item => ({
              name: item.name,
              quantity: Number(item.buyQuantity) || 0,
              price: item.price,
              total: (Number(item.buyQuantity) || 0) * parsePrice(item.price).toFixed(2),
            }));
  
            const orderData = {
              items: orderItems,
              totalOrderPrice: totalOrderPrice.toFixed(2),
              email: email,
              name: name,
              orderDate: new Date().toISOString(),
              deliveryAddress
            };
  
            await addOrderDetails(orderData);
            alert('Order placed successfully! New balance is: £' + newBalance.toFixed(2));
            clearBasket();
            setShowCheckout(false);
          } else {
            alert('Transaction cancelled: One or more items are out of stock.');
          }
        } else {
          alert('Insufficient balance for this transaction. Please top-up your account or use a different card.');
        }
      } else {
        alert('Invalid card details or user not found.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during the checkout process.');
    }
  };
  

  
  const style = {
    container: {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      width: '80%',
      margin: '30px auto',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      padding: '20px',
    },
    header: {
      marginBottom: '20px',
    },
    item: {
      borderBottom: '1px solid #eee',
      paddingBottom: '20px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    itemName: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    itemDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      fontSize: '16px',
    },
    quantity: {
      display: 'flex',
      alignItems: 'center',
    },
    quantityBtn: {
      padding: '5px 10px',
      margin: '0 5px',
      cursor: 'pointer',
    },
    removeBtn: {
      backgroundColor: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      padding: '5px 10px',
    },
    total: {
      fontSize: '20px',
      fontWeight: 'bold',
      textAlign: 'right',
      marginTop: '20px',
    },
    checkoutBtn: {
      backgroundColor: '#00C851',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
      display: 'block',
      width: '100%',
      marginTop: '20px',
    },
    formContainer: {
      padding: '2rem',
      background: '#fff',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '10px', 
      maxWidth: '500px', 
      margin: '2rem auto', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    form: {
      width: '100%',
    },
    formField: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginBottom: '1rem',
    },
    label: {
      marginBottom: '0.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#333',
    },
    input: {
      padding: '0.75rem',
      border: '1px solid #ccc',
      borderRadius: '5px', 
      fontSize: '1rem', 
      lineHeight: '1.5', 
    },
    submitBtn: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '1rem',
      borderRadius: '5px', 
      border: 'none', 
      cursor: 'pointer',
      margin: '1rem 0',
      width: 'auto', 
      alignSelf: 'center',
    },
    removeBtn: {
      backgroundColor: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      padding: '5px 10px',
      width: '100px',
    },
    checkoutBtn: {
      backgroundColor: '#00C851',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
      display: 'inline-block',
      width: '200px',
      marginLeft: 'auto', 
      marginRight: '0',
    },
    submitBtn: {
      backgroundColor: '#33b5e5',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
      maxWidth: '200px', 
      margin: '20px auto',
      display: 'block',
      
    },
    buttonContainer: {
      textAlign: 'right',
    },
  };
  return (
    <div style={style.container}>
      <h2 style={style.header}>Your Basket</h2>
      {basket.length > 0 ? (
        <>
          {basket.map((item, index) => (
            <div style={style.item} key={index}>
              <h4 style={style.itemName}>{item.name}</h4>
              <div style={style.itemDetails}>
                <p style={style.price}>Price: £{parsePrice(item.price).toFixed(2)}</p>
                <div style={style.quantity}>
                  <button style={style.quantityBtn} onClick={() => updateQuantity(index, -1)}>-</button>
                  <span>{Number(item.buyQuantity) || 0}</span>
                  <button style={style.quantityBtn} onClick={() => updateQuantity(index, 1)}>+</button>
                </div>
                <p>Total: £{(parsePrice(item.price) * (Number(item.buyQuantity) || 0)).toFixed(2)}</p>
                <button style={style.removeBtn} onClick={() => removeItem(index)}>Remove</button>
              </div>
            </div>
          ))}
          <h3 style={style.total}>Total Order Price: £{totalOrderPrice.toFixed(2)}</h3>
          <div style={style.buttonContainer}>
            <button style={style.checkoutBtn} onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p>Your basket is empty.</p>
      )}
      {showCheckout && (
        <div style={style.formContainer}>
          <h2>Complete Your Payment Details To place order</h2>
          <form ref={checkoutFormRef} style={style.form} onSubmit={handleCheckout}>
            <div style={style.formField}>
              <label style={style.label} htmlFor="name">Card Name:</label>
              <input style={style.input} type="text" id="name" name="name" required />
            </div>
            <div style={style.formField}>
              <label style={style.label} htmlFor="card-details">Card number:</label>
              <input style={style.input} type="text" id="card-details" name="card-details" required />
            </div>
            <div style={style.formField}>
              <label style={style.label} htmlFor="card-cvv">CVV:</label>
              <input style={style.input} type="text" id="card-cvv" name="card-cvv" required />
            </div>
            <div style={style.formField}>
              <label style={style.label} htmlFor="delivery-address">Delivery Address:</label>
              <textarea style={style.input} id="delivery-address" name="delivery-address" required></textarea>
            </div>
            <button style={style.submitBtn} type="submit">Submit Order</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BasketComponent;

