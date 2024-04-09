// Assuming 'use client' is a directive for your specific environment or bundler
"use client";

import React, { useState, useEffect } from 'react';
import { addLostPost } from '../actions/addLostPost'; // Make sure this path is correct


const AddLostPostComponent = () => {
  const [itemName, setItemName] = useState('');
  const [categories, setCategories] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [foundDate, setFoundDate] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('currentUserEmail');
    const storedUserName = localStorage.getItem('userName');
    if (storedEmail && storedUserName) {
      setUserEmail(storedEmail);
      setUserName(storedUserName);
    }
  }, []);

  const handlePictureChange = (event) => {
    setPictures([...event.target.files].slice(0, 3));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!privacyAgreement) {
      setMessage({ text: 'You must agree to the privacy policy.', isError: true });
      return;
    }

    const lostPostData = {
      itemName,
      categories,
      location,
      description,
      condition,
      privacyAgreement,
      foundDate,
      userEmail,
      userName,
      postTime: new Date().toISOString(),
    };

    const response = await addLostPost(lostPostData, pictures);
    setMessage({ text: response.message, isError: !response.success });
  };

  return (
    <div>
      <h2>Add Lost Item Post</h2>
      {message.text && <p style={{ color: message.isError ? 'red' : 'green' }}>{message.text}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item Name" required />
        <input type="text" value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="Categories" required />
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <select value={condition} onChange={(e) => setCondition(e.target.value)} required>
          <option value="">Select Condition</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
          <option value="Damaged">Damaged</option>
        </select>
        <input type="date" value={foundDate} onChange={(e) => setFoundDate(e.target.value)} required />
        <input type="file" multiple onChange={handlePictureChange} accept="image/*" />
        <label>
          <input type="checkbox" checked={privacyAgreement} onChange={(e) => setPrivacyAgreement(e.target.checked)} />
          Agree to Privacy Policy
        </label>
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
};

export default AddLostPostComponent;

