// app/actions/initiateChat.js
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

async function initiateChat(userId, receiverId) {
  // Logic to check if a chat exists between these users, if not, create one
  const chatId = `${userId}_${receiverId}`; // Simplistic way to generate a chatId, consider a more robust approach
  const chatRef = doc(db, "chats", chatId);

  const chatDoc = await getDoc(chatRef);
  if (!chatDoc.exists()) {
    await setDoc(chatRef, { created: new Date() }); // Initialize chat document with creation date
  }

  return chatId; // Return the chatId for routing to the chat UI
}

export default initiateChat;
