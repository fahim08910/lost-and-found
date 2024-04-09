// app/ui/ViewLostPostsComponent.js
/*
"use client"
import React, { useState, useEffect } from 'react';
import fetchLostPosts from '../actions/fetchLostPosts';

const ViewLostPostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      const postsData = await fetchLostPosts();
      setPosts(postsData);
    };

    getPosts();
  }, []);

  const openModal = (url) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <h2>Lost Item Posts</h2>
      {posts.map(post => (
        <div key={post.id} className="post" style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>{post.itemName}</h3>
          <p>User: {post.userName}</p>
          <p>Post Number: {post.postNumber}</p>
          <p>Posted On: {post.postTime.toLocaleDateString("en-US")}</p>
          <p>Category: {post.categories}</p>
          <p>Description: {post.description}</p>
          <p>Condition: {post.condition}</p>
          <p>Found Date: {post.foundDate}</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {post.pictures?.map((url, index) => (
              <img 
                key={index} 
                src={url} 
                alt="Lost item" 
                className="post-image" 
                style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }} 
                onClick={() => openModal(url)}
              />
            ))}
          </div>
        </div>
      ))}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeModal}
        >
          <img src={selectedImage} alt="Enlarged item" style={{ maxHeight: '90%', maxWidth: '90%' }} />
        </div>
      )}
    </div>
  );
};

export default ViewLostPostsComponent;
*/


// app/ui/ViewLostPostsComponent.js
//Without love button or save button
/*
"use client";
// app/ui/ViewLostPostsComponent.js
import React, { useState, useEffect } from 'react';
import fetchLostPosts from '../actions/fetchLostPosts';
import Link from 'next/link';

const ViewLostPostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      const postsData = await fetchLostPosts();
      setPosts(postsData);
    };

    getPosts();
  }, []);

  const openModal = (url) => setSelectedImage(url);
  const closeModal = () => setSelectedImage(null);

  return (
    <div>
      <h2>Lost Item Posts</h2>
      {posts.map(post => (
        <div key={post.id} className="post" style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>{post.itemName}</h3>
          <p>User: {post.userName}</p>
          <p>Post Number: {post.postNumber}</p>
          <p>Posted On: {new Date(post.postTime).toLocaleDateString("en-US")}</p>
          <p>Category: {post.categories}</p>
          <p>Description: {post.description}</p>
          <p>Condition: {post.condition}</p>
          <p>Found Date: {post.foundDate}</p>
          {post.pictures?.map((url, index) => (
            <img 
              key={index} 
              src={url} 
              alt="Lost item" 
              className="post-image" 
              style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }} 
              onClick={() => openModal(url)}
            />
          ))}
          <Link href={`/chat/${encodeURIComponent(post.userName)}`}>
            Send Message
          </Link>
        </div>
      ))}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }} 
          onClick={closeModal}
        >
          <img src={selectedImage} alt="Enlarged item" style={{ maxHeight: '90%', maxWidth: '90%' }} />
        </div>
      )}
    </div>
  );
};

export default ViewLostPostsComponent;


*/
"use client"
import React, { useState, useEffect } from 'react';
import fetchLostPosts from '../actions/fetchLostPosts';
import Link from 'next/link';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const ViewLostPostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const getPostsAndSavedStatus = async () => {
      const postsData = await fetchLostPosts();
      setPosts(postsData);
      await updateSavedPostsStatus();
    };

    getPostsAndSavedStatus();
  }, []);

  const openModal = (url) => setSelectedImage(url);
  const closeModal = () => setSelectedImage(null);

  const updateSavedPostsStatus = async () => {
    const userName = localStorage.getItem('userName');
    if (!userName) return;

    const userLikesRef = doc(db, "savePosts", userName);
    const docSnap = await getDoc(userLikesRef);
    if (docSnap.exists()) {
      const savedPostIds = docSnap.data().likedPosts.map(post => post.postId);
      setSavedPosts(savedPostIds);
    } else {
      // If no document exists, clear the savedPosts state
      setSavedPosts([]);
    }
  };

  const handleLovePost = async (post) => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      alert('User not found. Please log in.');
      return;
    }

    const userLikesRef = doc(db, "savePosts", userName);
    const docSnap = await getDoc(userLikesRef);

    if (docSnap.exists()) {
      // Append only if not already saved
      const existingPosts = docSnap.data().likedPosts;
      if (!existingPosts.some(likedPost => likedPost.postId === post.id)) {
        await updateDoc(userLikesRef, {
          likedPosts: [...existingPosts, {
            postId: post.id,
            postDetails: { ...post },
            likedOn: new Date(),
          }],
        });
        // Update the UI to reflect the change
        setSavedPosts([...existingPosts.map(post => post.postId), post.id]);
      }
    } else {
      // Create the first liked post if no document exists
      await setDoc(userLikesRef, {
        userName,
        likedPosts: [{
          postId: post.id,
          postDetails: { ...post },
          likedOn: new Date(),
        }],
      });
      // Update the UI to reflect the change
      setSavedPosts([post.id]);
    }
  };

  return (
    <div>
      <h2>Lost Item Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="post" style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>{post.itemName}</h3>
          <p>User: {post.userName}</p>
          <p>Post Number: {post.postNumber}</p>
          <p>Posted On: {new Date(post.postTime).toLocaleDateString("en-US")}</p>
          <p>Category: {post.categories}</p>
          <p>Description: {post.description}</p>
          <p>Condition: {post.condition}</p>
          <p>Found Date: {post.foundDate}</p>
          {post.pictures?.map((url, index) => (
            <img 
              key={index} 
              src={url} 
              alt="Lost item" 
              onClick={() => openModal(url)}
              className="post-image" 
              style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
            />
          ))}
          <div style={{ marginTop: '10px' }}>
          <button
              onClick={() => handleLovePost(post)}
              disabled={savedPosts.includes(post.id)}
              style={{ marginRight: '10px' }}>
              {savedPosts.includes(post.id) ? 'Saved' : '❤️ Save'}
            </button>
            <Link href={`/chat/${encodeURIComponent(post.userName)}`}>
              Send Message
            </Link>
          </div>
        </div>
      ))}
      {selectedImage && (
        <div 
          onClick={closeModal}
          style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <img src={selectedImage} alt="Enlarged item" style={{ maxHeight: '90%', maxWidth: '90%' }} />
        </div>
      )}
    </div>
  );
};

export default ViewLostPostsComponent;

