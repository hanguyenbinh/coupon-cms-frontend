import config from 'config';
import { authHeader } from '../_helpers';

import { common } from './common';
const handleResponse = common.handleResponse;

export const couponService = {
    initCoupon,
    getCoupons,
    getCouponGroups,
    updateCouponExpiredDate,
    getCouponsInGroup
};
function initCoupon(total, expiredDate) {
    const formData = new FormData();
    formData.append('total', total);
    formData.append('expiredDate', expiredDate);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`${config.apiUrl}/coupons`, requestOptions)
        .then(handleResponse)
        .then(coupon => {
            return coupon;
        });
}
function getCoupons(page = 1, type = 'all') {

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/coupons?page=${page}&type=${type}`, requestOptions)
        .then(handleResponse)
        .then(result => {
            if (result && result.success) {
                return result.data;
            }
            return [];
        });
}

function getCouponGroups(page = 1) {

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/groups?page=${page}`, requestOptions)
        .then(handleResponse)
        .then(result => {
            if (result && result.success) {
                return result.data;
            }
            return [];
        });
}

function updateCouponExpiredDate(groupId, expiredDate) {
    const formData = new FormData();
    formData.append('extDate', expiredDate);
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
            extDate: expiredDate
        })
    };

    return fetch(`${config.apiUrl}/groups/${groupId}`, requestOptions)
        .then(handleResponse)
        .then(result => {
            if (result && result.success) {
                return result.data;
            }
            return null;
        });
}

function getCouponsInGroup(groupId, page = 1, type = 'all') {

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/groups/${groupId}/coupons?page=${page}&type=${type}`, requestOptions)
        .then(handleResponse)
        .then(result => {
            if (result && result.success) {
                return result.data;
            }
            return [];
        });
}