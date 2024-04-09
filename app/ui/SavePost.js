"use client";
import React, { useState, useEffect } from 'react';
import { fetchSavedPosts } from '../actions/savePost';
import Link from 'next/link';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const SavePostComponent = () => {
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const getSavedPosts = async () => {
      const posts = await fetchSavedPosts();
      setSavedPosts(posts);
    };

    getSavedPosts();
  }, []);

  const handleRemovePost = async (postId) => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      alert('User not found. Please log in.');
      return;
    }

    const userLikesRef = doc(db, "savePosts", userName);

    // Filter out the post to be removed
    const updatedPosts = savedPosts.filter(post => post.postId !== postId);

    // Update the document with the filtered posts
    await updateDoc(userLikesRef, {
      likedPosts: updatedPosts,
    });

    // Update local state
    setSavedPosts(updatedPosts);
  };

  // Function to format Firestore timestamp to readable date
  const formatDate = (timestamp) => {
    let date;
  
    if (timestamp?.toDate) {
      // If timestamp is a Firestore Timestamp object
      date = timestamp.toDate();
    } else if (timestamp?.seconds) {
      // If timestamp is a serialized Firestore Timestamp object (e.g., from JSON)
      date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    } else {
      // If timestamp is already a JavaScript Date object or undefined/null
      date = timestamp ? new Date(timestamp) : new Date();
    }
  
    return date.toLocaleDateString("en-US"); // Format date as MM/DD/YYYY
  };

  return (
    <div>
      <h2>Saved Posts</h2>
      {savedPosts.length > 0 ? (
        savedPosts.map((post, index) => (
          <div key={index} className="post" style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>{post.postDetails.itemName}</h3>
            <p>User: {post.postDetails.userName}</p>
            <p>Post Number: {post.postDetails.postNumber}</p>
            {/* Use formatDate to display the posted on date correctly */}
            <p>Posted On: {formatDate(post.postDetails.postTime)}</p>
            <p>Category: {post.postDetails.categories}</p>
            <p>Description: {post.postDetails.description}</p>
            <p>Condition: {post.postDetails.condition}</p>
            <p>Found Date: {formatDate(post.postDetails.foundDate)}</p>
            {post.postDetails.pictures?.map((url, imageIndex) => (
              <img
                key={imageIndex}
                src={url}
                alt="Saved item"
                className="post-image"
                style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer', marginRight: '10px' }}
              />
            ))}
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleRemovePost(post.postId)} style={{ marginRight: '10px' }}>
                Remove
              </button>
              <Link href={`/chat/${encodeURIComponent(post.postDetails.userName)}`}>Send Message</Link>
            </div>
          </div>
        ))
      ) : (
        <p>No saved posts to display.</p>
      )}
    </div>
  );
};

export default SavePostComponent;
