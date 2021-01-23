import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { couponActions } from '../_actions';

function CouponPage() {
    const [page, setPage] = useState(1);
    const [type, setType] = useState('all');

    const [inputs, setInputs] = useState({
        groupId: '',
        extDate: ''
    });
    const { groupId, extDate } = inputs;
    const [submitted, setSubmitted] = useState(false);

    const coupons = useSelector(state => state.coupons);
    const couponGroups = useSelector(state => state.couponGroups);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(couponActions.getCouponGroups());
        dispatch(couponActions.getCoupons());        
    }, []);

    const handleChangePage = (num) => {
        setPage(num)
        dispatch(couponActions.getCoupons(num, type));
    }

    const handleTypeChange = (val) => {
        setType(val)
        setPage(1)
        dispatch(couponActions.getCoupons(page, val));
    }

    function handleInputsChange(e) {
        const { name, value } = e.target;
        console.log(name, value);
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (groupId && extDate) {
            // get return url from location state or default to home page
            // const { from } = location.state || { from: { pathname: "/" } };
            dispatch(couponActions.updateCouponExpiredDate(groupId, extDate));
        }
    }    

    return (
        <div className="col-lg-8 offset-lg-2">
            <h1>Coupon manager</h1>
            <h3>All coupons:</h3>
            <h5>
                Action:
                <div>
                    Extend more days for coupons
                    <form name="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Coupon groups</label>
                            <select name="groupId" value={groupId} onChange={handleInputsChange} className={'form-control'}>
                            {couponGroups.items && couponGroups.items.map((item,index)=>
                            <option key={item.id} value={item.id}>{'total: ' + item.totalInit + ', created: ' + item.created_at}</option>
                            )}
                            </select>                            
                        </div>
                        <div className="form-group">
                            <label>Extend date</label>
                            <input type="text" name="extDate" value={extDate} onChange={handleInputsChange} className={'form-control' + (submitted && !extDate ? ' is-invalid' : '')} />
                            {submitted && !extDate &&
                                <div className="invalid-feedback">Extend date is required</div>
                            }
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">
                        Update
                    </button>
                            {submitted && <div className="invalid-feedback">Wrong datetime format or current date not less than extend date</div>}
                        </div>
                    </form>
                </div>
                <button onClick={() => handleTypeChange('all')} disabled={type === 'all'}>All</button>
                <button onClick={() => handleTypeChange('redeem')} disabled={type === 'redeem'}>Redeem</button>
                <button onClick={() => handleTypeChange('notredeem')} disabled={type === 'notredeem'}>Not Redeem</button>
                <button onClick={() => handleTypeChange('expired')} disabled={type === 'expired'}>Expired</button>

            </h5>
            <h5>
                Select:
                <button onClick={() => handleTypeChange('all')} disabled={type === 'all'}>All</button>
                <button onClick={() => handleTypeChange('redeem')} disabled={type === 'redeem'}>Redeem</button>
                <button onClick={() => handleTypeChange('notredeem')} disabled={type === 'notredeem'}>Not Redeem</button>
                <button onClick={() => handleTypeChange('expired')} disabled={type === 'expired'}>Expired</button>

            </h5>
            <button disabled={page <= 1} onClick={() => handleChangePage(page - 1)}>previous</button>
            <button disabled={!coupons.items || coupons.items.length < 50} onClick={() => handleChangePage(page + 1)}>next</button>
            {coupons.loading && <em>Loading coupons...</em>}
            {coupons.error && <span className="text-danger">ERROR: {coupons.error}</span>}
            {coupons.items &&
                <ul>
                    {coupons.items.map((coupon, index) =>
                        <li key={coupon.id}>
                            {coupon.code + ':   ' + coupon.expiredDate}
                        </li>
                    )}
                </ul>
            }
        </div>
    );
}

export { CouponPage };