import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { couponActions } from '../_actions';

function CouponPage() {
    const [page, setPage] = useState(1);
    const [type, setType] = useState('all');

    const [initInputs, setInitInputs] = useState({
        total: '',
        expiredDate: ''
    });
    const { total, expiredDate } = initInputs;

    const [inputs, setInputs] = useState({
        groupId: '',
        extDate: ''
    });
    const { groupId, extDate } = inputs;
    const [submitted, setSubmitted] = useState(false);
    const [initSubmitted, setInitSubmitted] = useState(false);

    const coupons = useSelector(state => state.coupons);
    const couponGroups = useSelector(state => state.couponGroups);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(couponActions.getCouponGroups());
        dispatch(couponActions.getCoupons());
    }, []);

    const handlePageChanged = (num) => {
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

    function handleInitInputsChange(e) {
        const { name, value } = e.target;
        console.log(name, value);
        setInitInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (groupId && extDate) {
            dispatch(couponActions.updateCouponExpiredDate(groupId, extDate));
        }
    }

    function handleInitSubmit(e) {
        e.preventDefault();
        setInitSubmitted(true);
        if (total && expiredDate) {
            dispatch(couponActions.initCoupon(total, expiredDate));
        }
    }

    return (
        <div className="col-xs-6">
            <h1>Coupon manager</h1>
            <p><Link to='/'>Home</Link></p>
            <p><Link to='/groups'>Groups</Link></p>            
            <h3>
                Init coupons:
                </h3>
            <div>
                <form name="form" onSubmit={handleInitSubmit}>
                    <div className="form-group">
                        <label>Total coupons to init</label>
                        <input type="text" name="total" value={total} onChange={handleInitInputsChange} className={'form-control' + (initSubmitted && !total ? ' is-invalid' : '')} />
                        {initSubmitted && !total &&
                            <div className="invalid-feedback">total is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <label>Expired date</label>
                        <input type="text" name="expiredDate" value={expiredDate} onChange={handleInitInputsChange} className={'form-control' + (initSubmitted && !expiredDate ? ' is-invalid' : '')} />
                        {initSubmitted && !expiredDate &&
                            <div className="invalid-feedback">Expired date is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">
                            Init
                    </button>
                    </div>
                </form>
            </div>
            <h3>
                Action:
                </h3>
            <div>
                Extend more days for coupons
                    <form name="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Coupon groups</label>
                        <select name="groupId" value={groupId} onChange={handleInputsChange} className={'form-control'}>
                            {couponGroups.items && couponGroups.items.map((item, index) =>
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

            <h3>
                Select:
                </h3>
            <button className="btn btn-secondary" onClick={() => handleTypeChange('all')} disabled={type === 'all'}>All</button>
            <button className="btn btn-secondary" onClick={() => handleTypeChange('redeem')} disabled={type === 'redeem'}>Redeem</button>
            <button className="btn btn-secondary" onClick={() => handleTypeChange('notredeem')} disabled={type === 'notredeem'}>Not Redeem</button>
            <button className="btn btn-secondary" onClick={() => handleTypeChange('expired')} disabled={type === 'expired'}>Expired</button>


            <h3>All coupons: {coupons.total ? coupons.total : 0}</h3>
            <h5>current page: {page}</h5>
            <button className="btn btn-secondary" disabled={page <= 1} onClick={() => handlePageChanged(page - 1)}>previous</button>
            <button className="btn btn-secondary" disabled={!coupons.items || coupons.items.length < 20} onClick={() => handlePageChanged(page + 1)}>next</button>
            {coupons.loading && <em>Loading coupons...</em>}
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Code</th>
                        <th scope="col">Expired date</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.items &&
                        coupons.items.map((coupon, index) =>
                            <tr key={coupon.id}>
                                <td>{index + 1}</td>
                                <td>{coupon.code}</td>
                                <td>{coupon.expiredDate}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {coupons.error && <span className="text-danger">ERROR: {coupons.error}</span>}
        </div>
    );
}

export { CouponPage };