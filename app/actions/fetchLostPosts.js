// app/actions/fetchLostPosts.js

// app/actions/fetchLostPosts.js


import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const fetchLostPosts = async () => {
  const q = query(collection(db, "lost-post"), orderBy("postTime", "desc"));
  const querySnapshot = await getDocs(q);
  const postsData = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    postTime: new Date(doc.data().postTime.seconds * 1000),
  }));
  return postsData;
};

export default fetchLostPosts;


