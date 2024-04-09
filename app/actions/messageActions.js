// app/actions/messageActions.js
/*
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const getChatsForUser = async (userName) => {
  if (!userName) return [];

  const chatsRef = collection(db, 'chats');
  const snapshot = await getDocs(chatsRef);

  // Filter chats where the current user is a participant based on the document ID
  const chats = snapshot.docs
    .filter(doc => doc.id.includes(userName))
    .map(doc => ({
      chatId: doc.id,
      messages: doc.data().messages || [],
    }));

  return chats;
};

*/
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, arrayUnion, serverTimestamp, onSnapshot } from 'firebase/firestore';

export const getChatsForUser = async (userName) => {
  if (!userName) return [];

  const chatsRef = collection(db, 'chats');
  const snapshot = await getDocs(chatsRef);
  return snapshot.docs
    .filter(doc => doc.id.includes(userName))
    .map(doc => ({
      chatId: doc.id,
      messages: doc.data().messages || [],
    }));
};

export const listenForChatUpdates = (userName, setChats) => {
  if (!userName) return;

  getChatsForUser(userName).then(initialChats => {
    setChats(initialChats);
    initialChats.forEach(chat => {
      const chatDocRef = doc(db, 'chats', chat.chatId);
      onSnapshot(chatDocRef, (docSnapshot) => {
        const updatedChat = { chatId: docSnapshot.id, messages: docSnapshot.data().messages || [] };
        setChats(currentChats => {
          const index = currentChats.findIndex(c => c.chatId === updatedChat.chatId);
          if (index > -1) {
            return [...currentChats.slice(0, index), updatedChat, ...currentChats.slice(index + 1)];
          }
          return [...currentChats, updatedChat];
        });
      });
    });
  });
};

export const sendMessageToChat = async (chatId, userName, message) => {
  if (!message.trim()) return;

  const chatDocRef = doc(db, 'chats', chatId);
  const newMessage = {
    sender: userName,
    text: message,
    timestamp: new Date(), 
  };

  await updateDoc(chatDocRef, {
    messages: arrayUnion(newMessage),
    lastUpdated: serverTimestamp(),
  });
};