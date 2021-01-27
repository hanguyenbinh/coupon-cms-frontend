import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { couponActions } from '../_actions';
import { Modal } from 'react-bootstrap';

function CouponGroupPage() {
    const [page, setPage] = useState(1);

    const [inputs, setInputs] = useState({
        groupId: '',
        extDate: ''
    });
    const { groupId, extDate } = inputs;
    const [submitted, setSubmitted] = useState(false);

    const [selectedGroup, setSelectedGroup] = useState();
    const [show, setShow] = useState(false);

    const couponGroups = useSelector(state => state.couponGroups);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(couponActions.getCouponGroups());
    }, []);

    const handlePageChanged = (num) => {
        setPage(num)
        dispatch(couponActions.getCouponGroups(num));
    }
    const handleSelectGroup = (groupId) => {
        setSelectedGroup(groupId);
        dispatch(couponActions.getCouponsInGroup(groupId));
        setInputs(inputs => ({ ...inputs, ['groupId']: groupId }));
        setShow(true);
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    function handleInputsChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }
    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (groupId && extDate) {
            dispatch(couponActions.updateCouponExpiredDate(groupId, extDate));
            dispatch(couponActions.getCouponsInGroup(groupId));
        }

    }
    return (
        <div className="col-xs-6">
            <h1>Coupon group manager</h1>

            <h3>All groups: {couponGroups.total ? couponGroups.total : 0}</h3>
            <h5>current page: {page}</h5>
            <button className="btn btn-secondary" disabled={page <= 1} onClick={() => handlePageChanged(page - 1)}>previous</button>
            <button className="btn btn-secondary" disabled={!couponGroups.items || couponGroups.items.length < 20} onClick={() => handlePageChanged(page + 1)}>next</button>
            {couponGroups.loading && <em>Loading couponGroups...</em>}
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Id</th>
                        <th scope="col">Total init</th>
                        <th scope="col">User Id</th>
                    </tr>
                </thead>
                <tbody>
                    {couponGroups.items &&
                        couponGroups.items.map((couponGroup, index) =>
                            <tr key={couponGroup.id} onClick={() => handleSelectGroup(couponGroup.id)}>
                                <td>{index + 1}</td>
                                <td>{couponGroup.id}</td>
                                <td>{couponGroup.totalInit}</td>
                                <td>{couponGroup.userId}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {couponGroups.error && <span className="text-danger">ERROR: {couponGroups.error}</span>}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={true}
                size="lg"
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Coupons on group with id={selectedGroup}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Extend more days for coupons
                    <form name="form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Coupon groups</label>
                                <input readOnly type="text" name="groupId" value={groupId} className={'form-control'}></input>
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
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Code</th>
                                <th scope="col">Expired Date</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {couponGroups.coupons && couponGroups.coupons.map((coupon, index) =>
                                <tr key={coupon.id}>
                                    <td>{(page - 1) * 20 + index + 1}</td>
                                    <td>{coupon.code}</td>
                                    <td>{coupon.expiredDate}</td>
                                    <td>{coupon.redeemId ? 'redeemed' : 'available'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </Modal.Body>
            </Modal>

        </div>
    );
}

export { CouponGroupPage };