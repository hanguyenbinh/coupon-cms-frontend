import React from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function Header() {
    return (
        <div>
            <Link to='/'><button className='btn btn-primary'>Home</button></Link>
            <Link to='/coupons'><button className='btn btn-primary'>Coupons manager</button></Link>
            <Link to='/groups'><button className='btn btn-primary'>Coupon groups manager</button></Link>
            <Link to='/gifts'><button className='btn btn-primary'>Gift manager</button></Link>
        </div>
    );
}

export { Header };