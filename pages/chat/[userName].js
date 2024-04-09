// pages/chat/[userName].js
/*
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { db } from '../../app/firebase/config'; // Corrected import path
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

const ChatPage = () => {
  const router = useRouter();
  const { userName } = router.query; // userName from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Placeholder function to mimic retrieving the current user's ID
  const getCurrentUserId = () => 'currentUserId';

  useEffect(() => {
    if (!userName) return;
    
    // Construct the chat room ID using both the current user's ID and the other user's username
    const currentUserId = getCurrentUserId();
    const chatRoomId = `${currentUserId}_${userName}`;
    
    const messagesRef = collection(db, `chats/${chatRoomId}/messages`);
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [userName]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const currentUserId = getCurrentUserId();
    const chatRoomId = `${currentUserId}_${userName}`;

    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, `chats/${chatRoomId}/messages`), {
        text: newMessage,
        sender: currentUserId,
        timestamp: new Date(),
      });

      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div>
      <h2>Chat with: {decodeURIComponent(userName)}</h2>
      <div style={{ marginBottom: '20px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: '10px', backgroundColor: msg.sender === getCurrentUserId() ? '#ddd' : '#eee' }}>
            {msg.sender === getCurrentUserId() ? 'You' : msg.sender}: {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flexGrow: 1, marginRight: '10px' }}
          autoFocus
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
*/
// pages/chat/[userName].js
// pages/chat/[userName].js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../app/firebase/config';
import { doc, onSnapshot, updateDoc, arrayUnion, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';

const ChatPage = () => {
  const router = useRouter();
  const { userName: receiverUserName } = router.query; // Receiver's userName from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatDocumentId, setChatDocumentId] = useState('');

  useEffect(() => {
    const fetchUserAndListen = async () => {
      const senderUserName = localStorage.getItem('userName');
      if (!senderUserName || !receiverUserName) {
        setLoading(false);
        return;
      }

      const chatId = [senderUserName, receiverUserName].sort().join('_');
      setChatDocumentId(chatId); // Set the chat document ID
      listenToMessages(chatId);
    };

    fetchUserAndListen();
  }, [receiverUserName]);

  // Function to listen for messages in the chat document
  const listenToMessages = (chatId) => {
    const chatDocRef = doc(db, 'chats', chatId);

    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      setLoading(false);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setMessages(data.messages || []);
      }
    });

    return unsubscribe;
  };

  // Function to handle sending messages
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatDocumentId) return;

    const senderUserName = localStorage.getItem('userName');
    const chatDocRef = doc(db, 'chats', chatDocumentId);
    
    try {
        const docSnapshot = await getDoc(chatDocRef);
        let messages = [];

        if (docSnapshot.exists()) {
            // Fetch current messages and append the new one
            const data = docSnapshot.data();
            messages = data.messages ? [...data.messages] : [];
        }

        // Append new message with client-side timestamp
        const newMessageData = {
            sender: senderUserName,
            text: newMessage,
            timestamp: new Date(), // Use client-side timestamp for consistency
        };
        messages.push(newMessageData);

        // Update or set the document with the new messages array
        await setDoc(chatDocRef, { messages }, { merge: true });

        setNewMessage('');
    } catch (error) {
        console.error("Error sending message: ", error);
    }
};



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Chat with: {receiverUserName}</h2>
      <div style={{ marginBottom: '20px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: '10px', backgroundColor: msg.sender === localStorage.getItem('userName') ? '#ddd' : '#eee' }}>
            {msg.sender}: {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flexGrow: 1, marginRight: '10px' }}
          autoFocus
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;









