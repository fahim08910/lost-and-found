// app/ui/MessagesComponent.js
/*
"use client"
import React, { useState, useEffect } from 'react';
import { getChatsForUser } from '../actions/messageActions';

const MessagesComponent = () => {
  const [chats, setChats] = useState([]);
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;

  useEffect(() => {
    if (userName) {
      getChatsForUser(userName).then(setChats);
    }
  }, [userName]);

  return (
    <div>
      <h2>My Messages</h2>
      {chats.length > 0 ? (
        chats.map(chat => (
          <div key={chat.chatId}>
            <p>Chat: {chat.chatId}</p>
            <div>
              {chat.messages.map((msg, index) => (
                <p key={index}>
                  <strong>{msg.sender}:</strong> {msg.text}
                </p>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
};

export default MessagesComponent;
*/











/// WORKING PERFECTLY
/*
"use client"

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc, arrayUnion, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { getChatsForUser } from '../actions/messageActions';

const MessagesComponent = () => {
  const [chats, setChats] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : '';

  useEffect(() => {
    const fetchAndListenToChats = async () => {
      if (!userName) return;

      const initialChats = await getChatsForUser(userName);
      setChats(initialChats);

      // Assuming `getChatsForUser` returns an array of chat IDs or chat objects with IDs
      initialChats.forEach(chat => {
        const chatDocRef = doc(db, 'chats', chat.chatId);
        onSnapshot(chatDocRef, (docSnapshot) => {
          const updatedChat = { chatId: docSnapshot.id, messages: docSnapshot.data().messages || [] };
          setChats(currentChats => {
            const index = currentChats.findIndex(c => c.chatId === updatedChat.chatId);
            if (index > -1) {
              return [...currentChats.slice(0, index), updatedChat, ...currentChats.slice(index + 1)];
            } else {
              return [...currentChats, updatedChat];
            }
          });
        });
      });
    };

    fetchAndListenToChats();
  }, [userName]);

  const sendMessage = async (chatId) => {
    if (!currentMessage.trim()) return;

    const chatDocRef = doc(db, 'chats', chatId);

    try {
      const newMessage = {
        sender: userName,
        text: currentMessage,
        timestamp: new Date(), // Consider changing this to serverTimestamp() for consistency across clients
      };

      await updateDoc(chatDocRef, {
        messages: arrayUnion(newMessage),
        lastUpdated: serverTimestamp(),
      });

      // Manually update the local state to reflect the new message
      setChats(chats.map(chat => {
        if (chat.chatId === chatId) {
          return { ...chat, messages: [...chat.messages, newMessage] };
        }
        return chat;
      }));

      setCurrentMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div>
      <h2>My Messages</h2>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.chatId}>
            <p>Chat: {chat.chatId}</p>
            <div>
              {chat.messages.map((msg, index) => (
                <p key={index}>
                  <strong>{msg.sender}:</strong> {msg.text}
                </p>
              ))}
            </div>
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Write a message..."
            />
            <button onClick={() => sendMessage(chat.chatId.toLowerCase())}>Send</button>
          </div>
        ))
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
};

export default MessagesComponent;
*/
/*
"use client"

import React, { useState, useEffect } from 'react';
import { listenForChatUpdates, sendMessageToChat } from '../actions/messageActions';

const MessagesComponent = () => {
  const [chats, setChats] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : '';

  useEffect(() => {
    listenForChatUpdates(userName, setChats);
  }, [userName]);

  const sendMessage = async (chatId) => {
    try {
      await sendMessageToChat(chatId, userName, currentMessage);
      setCurrentMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  

  return (
    <div>
      <h2>My Messages</h2>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.chatId}>
            <p>Chat: {chat.chatId}</p>
            <div>
              {chat.messages.map((msg, index) => (
                <p key={index}>
                  <strong>{msg.sender}:</strong> {msg.text}
                </p>
              ))}
            </div>
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Write a message..."
            />
            <button onClick={() => sendMessage(chat.chatId.toLowerCase())}>Send</button>
          </div>
        ))
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
};


export default MessagesComponent;
*/
// Import necessary hooks and services
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { listenForChatUpdates, sendMessageToChat } from '../actions/messageActions';

const MessagesComponent = () => {
  const [chats, setChats] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState('');
  const messagesEndRef = useRef(null);
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : '';
  const handleChatSelection = (chatId) => {
    setActiveChatId(chatId);
  };

  // Updated styles with chat item styles included
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '80vh',
    },
    chatWindow: {
      flex: 1,
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '28px', // Adjust this value so it's at least as tall as the inputSection height.
      overflowY: 'scroll',
    },
    chatList: {
      width: '30%',
      overflowY: 'scroll',
      borderRight: '1px solid #ccc',
      padding: '10px',
    },
    chatItem: {
      padding: '10px',
      margin: '5px 0',
      cursor: 'pointer',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.2s',
    },
    chatItemSelected: {
      backgroundColor: '#f0f0f0', // Different background for selected chat
    },
    
    messagesContainer: {
      paddingBottom: '60px', // Space for the input section
    },
    message: {
      margin: '5px 0',
      padding: '10px',
      borderRadius: '10px',
      maxWidth: '60%',
      wordBreak: 'break-all', // This will ensure the text breaks at the character limit
    },
    messageOutgoing: {
      backgroundColor: '#dcf8c6',
      marginLeft: 'auto',
      marginRight: '10px',
    },
    messageIncoming: {
      backgroundColor: 'blue',
      color: 'white',
      marginRight: 'auto',
      marginLeft: '10px',
    },
    
    inputSection: {
      position: 'fixed',
      bottom: 0,
      left: '30%', // Align with the chat window's start
      width: '70%', // Align with the chat window's width
      
      display: 'flex',
      padding: '10px',
    },
    input: {
      flexGrow: 1,
      marginRight: '5px',
      padding: '10px',
      borderRadius: '20px',
      border: '1px solid #ccc',
    },
    sendButton: {
      padding: '10px 15px',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
    },
    
    
  };

  useEffect(() => {
    listenForChatUpdates(userName, setChats);
  }, [userName]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatId, chats]);

  const sendMessageHandler = async () => {
    if (!currentMessage.trim()) return;
    try {
      await sendMessageToChat(activeChatId, userName, currentMessage);
      setCurrentMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const renderPreviewMessage = (message) => {
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  };
  const activeChat = chats.find(chat => chat.chatId === activeChatId);


  return (
    <div style={styles.container}>
      <div style={styles.chatList}>
        <h2>Chats</h2>
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1] || {};
          const isSelected = chat.chatId === activeChatId;
          return (
            <div
              key={chat.chatId}
              onClick={() => handleChatSelection(chat.chatId)}
              style={{
                ...styles.chatItem,
                ...(isSelected ? styles.chatItemSelected : {}),
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = isSelected ? '#f0f0f0' : 'transparent')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{chat.chatId.replace('_', ' ').replace(userName, '')}:</strong>
                {chat.unreadCount > 0 && (
                  <span style={{ backgroundColor: 'red', borderRadius: '50%', color: 'white', padding: '0 5px' }}>
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              <div>{lastMessage.sender === userName ? 'You: ' : ''}{renderPreviewMessage(lastMessage.text)}</div>
              {isSelected && chat.lastSeen && <div>Seen</div>}
            </div>
          );
        })}
      </div>
  
      {activeChat && (
      <>
        <div style={styles.chatWindow}>
      {activeChat.messages.map((msg, index) => {
        const isOwnMessage = msg.sender === userName;
        return (
          <div
            key={index}
            style={isOwnMessage ? { ...styles.message, ...styles.messageOutgoing } : { ...styles.message, ...styles.messageIncoming }}
          >
            {msg.text}
          </div>
        );
      })}
      <div ref={messagesEndRef}></div>
    </div>
        
          <div style={styles.inputSection}>
          <input
            style={styles.input}
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessageHandler()}
          />
          <button style={styles.sendButton} onClick={sendMessageHandler}>
            Send
          </button>
        </div>
      </>
    )}
  </div>
);
};  

export default MessagesComponent;