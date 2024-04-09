"use client"
import React, { useEffect, useState } from 'react';
import AddProductComponent from 'app/ui/addproduct';
import DeleteProductComponent from 'app/ui/deleteproduct';
import UpdateProductComponent from 'app/ui/updateproduct';
import SearchComponent from 'app/ui/SearchComponent';
import AllItemsComponent from 'app/ui/AllItemsComponent';
import AdminSignup from 'app/ui/adminsignup';
import UpdateUserComponent from 'app/ui/UpdateUserComponent';
import AddCardComponent from 'app/ui/addcard';

function Page() {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    if (isLoggedIn && userRole === 'admin') {
      setHasAccess(true);
    }
  }, []);

  if (!hasAccess) {
    return (
      <div className="admin-page">
        <h2>Login as an admin to access this page.</h2>
      </div>
    );
  }
  return (
    <div className="admin-page">
      <h2 className="admin-header">Admin Page</h2>
      <div className="admin-container">
        <div className="admin-component">
          <AddProductComponent />
        </div>
        <div className="admin-component">
          <DeleteProductComponent />
        </div>
        <div className="admin-component">
          <UpdateProductComponent />
        </div>
        <div className="admin-component">
          <AdminSignup />
        </div>
        <div className="admin-component">
          <UpdateUserComponent/>
        </div>
        <div className="admin-component">
          <AddCardComponent/>
        </div>
      </div>
      <h2>Search Product</h2>
      <SearchComponent />
      <h2>Listed Product</h2>
      <AllItemsComponent />
    </div>
  );
}

export default Page;
