/*"use client"
import React, { useState, useEffect } from 'react';
import fetchLostPosts from '../actions/fetchEditPosts';

const EditPostComponent = () => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getFilteredPosts = async () => {
      const userName = localStorage.getItem('userName');
      if (userName) {
        const filteredPosts = await fetchLostPosts(userName);
        setPosts(filteredPosts);
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

export default EditPostComponent; */
"use client"

import React, { useState, useEffect } from 'react';
import fetchLostPosts, { deletePost, updatePost } from '../actions/fetchEditPosts';

const EditPostComponent = () => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // Retrieve the username from localStorage
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const getFilteredPosts = async () => {
      if (userName) {
        const filteredPosts = await fetchLostPosts(userName);
        setPosts(filteredPosts.sort((a, b) => b.postTime - a.postTime));
      }
    };
    getFilteredPosts();
  }, [userName]);

  const handleEditFormChange = (event) => {
    setEditFormData({
      ...editFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const askEditPost = (post) => {
    setEditFormData({
      ...post,
      foundDate: post.foundDate?.split('T')[0] // Assuming foundDate is in ISO format
    });
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    await updatePost(editFormData.id, editFormData, selectedFile);
    // Optionally, you can directly update the state to reflect changes without re-fetching
    // This would be more efficient and provide a better user experience
    setShowEditModal(false);
    setSelectedFile(null); // Reset file selection

    // Re-fetch posts after update
    fetchPosts(); // Call a function that fetches posts again

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
};

  const openModal = (url) => setSelectedImage(url);
  const closeModal = () => setSelectedImage(null);

  const askDeletePost = (postId) => {
    setShowDeleteConfirmation(true);
    setDeletePostId(postId);
  };

  const confirmDelete = async () => {
    await deletePost(deletePostId);
    setPosts(posts.filter(post => post.id !== deletePostId));
    setShowDeleteConfirmation(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };
  const fetchPosts = async () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        const filteredPosts = await fetchLostPosts(userName);
        setPosts(filteredPosts.sort((a, b) => b.postTime - a.postTime));
    }
};
useEffect(() => {
  fetchPosts();
}, []);

  return (
    <div>
      <h2>My Lost Item Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post" style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
             <h3>{post.itemName}</h3>
             {userName && <h3>Username: {userName}</h3>}
            <p>Post Number: {post.postNumber}</p>
            <p>Posted On: {new Date(post.postTime).toLocaleDateString("en-US")}</p>
            <p>Category: {post.categories}</p>
            <p>Description: {post.description}</p>
            <p>Condition: {post.condition}</p>
            <p>Found Date: {post.foundDate}</p>
            {post.pictures?.map((url, index) => (
              <img key={index} src={url} alt="Lost item" onClick={() => openModal(url)} style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }} />
            ))}
            <button onClick={() => askEditPost(post)}>Edit</button>
            <button onClick={() => askDeletePost(post.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
  
      {/* Modal for editing post */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', zIndex: 1002 }}>
          <h2>Edit Post</h2>
          <div>
            <label>Name:</label>
            <input type="text" name="itemName" value={editFormData.itemName || ''} onChange={handleEditFormChange} placeholder="Item Name" />
          </div>
          <div>
            <label>Category:</label>
            <input type="text" name="categories" value={editFormData.categories || ''} onChange={handleEditFormChange} placeholder="Category" />
          </div>
          <div>
            <label>Description:</label>
            <input type="text" name="description" value={editFormData.description || ''} onChange={handleEditFormChange} placeholder="Description" />
          </div>
          <div>
            <label>Condition:</label>
            <input type="text" name="condition" value={editFormData.condition || ''} onChange={handleEditFormChange} placeholder="Condition" />
          </div>
          <div>
            <label>Found Date:</label>
            <input type="date" name="foundDate" value={editFormData.foundDate || ''} onChange={handleEditFormChange} />
          </div>
          <div>
            <label>Image:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button onClick={confirmEdit}>Update Post</button>
          <button onClick={() => setShowEditModal(false)}>Cancel</button>
        </div>
      )}
  
      {/* Modals for image view, delete confirmation, and success message */}
      {selectedImage && (
        <div onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <img src={selectedImage} alt="Enlarged item" style={{ maxHeight: '90%', maxWidth: '90%' }} />
        </div>
      )}
  
      {showDeleteConfirmation && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', zIndex: 1001 }}>
          <p>Are you sure you want to delete this post?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={() => setShowDeleteConfirmation(false)}>No</button>
        </div>
      )}
  
      {showSuccessMessage && (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f0', padding: '10px', zIndex: 1001 }}>
          <p>Post updated successfully!</p>
        </div>
      )}
    </div>
  );
  
  
};  

export default EditPostComponent;

