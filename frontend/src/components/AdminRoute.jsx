import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {

  const { userInfo } = useSelector((state) => state.auth);
  // console.log( userInfo.name , userInfo.isAdmin );

  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to='/login' replace />;
};

export default AdminRoute;