import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';

function HomePage() {
    const {user} = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();
    const handleLogout = ()=>{
        dispatch(userActions.logout());
    }    

    return (
        <div className="col-xs-6">
            <h1>Hi {user.name}!</h1>
            <p>Welcome to Coupon CMS</p>
            <p>
                <Link to='/coupons'>manage coupon</Link>
            </p>
            <p>
                <Link to='/groups'>manage group of coupon</Link>
            </p>
            <p>
                <button onClick={handleLogout}>logout</button>
            </p>
        </div>
    );
}

export { HomePage };