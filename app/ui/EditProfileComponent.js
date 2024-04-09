// EditProfileComponent.js
"use client"
import React, { useState, useEffect } from 'react';
import fetchLostPosts from '../actions/fetchLostPosts';

const EditPostComponent = () => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getFilteredPosts = async () => {
      const userName = localStorage.getItem('userName');
      if (userName) {
        const filteredPosts = await fetchLostPosts(userName);
        // Order posts client-side
        const orderedPosts = filteredPosts.sort((a, b) => b.postTime - a.postTime);
        setPosts(orderedPosts);
      }
    };

    getFilteredPosts();
  }, []);

  const openModal = (url) => setSelectedImage(url);
  const closeModal = () => setSelectedImage(null);

  return (
    <div>
      <h2>My Lost Item Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post" style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>{post.itemName}</h3>
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
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
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

export default EditPostComponent;





