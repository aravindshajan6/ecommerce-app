import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {

    const { userInfo } = useSelector((state) => state.auth);
    // console.log(userInfo.name , userInfo.isAdmin );


    return (
        userInfo ? ( <Outlet />) : ( <Navigate to='/login' replace />)
    )
}

export default PrivateRoute;