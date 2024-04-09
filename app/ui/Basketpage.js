"use client"
import React, { useState, useEffect } from 'react';
import BasketComponent from './BasketComponent';

const BasketPage = () => {
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    const basketData = savedBasket ? JSON.parse(savedBasket) : [];
    const basketWithCorrectQuantities = basketData.map(item => ({
      ...item,
      buyQuantity: Number(item.buyQuantity) || 1,
    }));
    setBasket(basketWithCorrectQuantities);
  }, []);

  const removeItem = (indexToRemove) => {
    const newBasket = basket.filter((_, index) => index !== indexToRemove);
    setBasket(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  };

  const updateQuantity = (indexToUpdate, change) => {
    const newBasket = basket.map((item, index) => {
      if (index === indexToUpdate) {
        const newQuantity = Math.max(1, Number(item.buyQuantity) + change);
        return { ...item, buyQuantity: newQuantity };
      }
      return item;
    });
    setBasket(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  };

  const clearBasket = () => {
    setBasket([]);
    localStorage.removeItem('basket');
  };

  return (
    <div>
      <BasketComponent basket={basket} removeItem={removeItem} updateQuantity={updateQuantity} clearBasket={clearBasket} />
    </div>
  );
};

export default BasketPage;

