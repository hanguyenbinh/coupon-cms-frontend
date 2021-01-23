import config from 'config';
import { authHeader, history } from '../_helpers';

export const couponService = {
    initCoupon,
    getCoupons,
    getCouponGroups,
    updateCouponExpiredDate
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

function getOneCoupon(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/coupons/${id}`, requestOptions)
        .then(handleResponse)
        .then(result => {
            if (result && result.success) {
                return result.data;
            }
            return null;
        });
}


function logout() {
    // remove coupon from local storage to log coupon out
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
    };
    fetch(`${config.apiUrl}/auth/logout`, requestOptions)
        .then(coupon => {
            console.log('logout');
        });
    localStorage.removeItem('coupon');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    // return fetch(`${config.apiUrl}/auth`, requestOptions).then(handleResponse);
    return [];
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/auth/coupon`, requestOptions).then(handleResponse);
}

function register(coupon) {
    console.log('coupon.register', coupon)
    const formData = new FormData();
    formData.append('email', coupon.couponname);
    formData.append('password', coupon.password);
    formData.append('password_confirmation', coupon.password_confirmation);
    formData.append('name', coupon.name);
    const requestOptions = {
        method: 'POST',
        body: formData
    };

    return fetch(`${config.apiUrl}/auth/register`, requestOptions).then(handleResponse);
}

function update(coupon) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon)
    };

    // return fetch(`${config.apiUrl}/auth/${coupon.id}`, requestOptions).then(handleResponse);;
    return null;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    // return fetch(`${config.apiUrl}/auth/${id}`, requestOptions).then(handleResponse);
    return null;
}


function getCouponGroups(page = 1, type = 'all') {

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/groups?page=${page}&type=${type}`, requestOptions)
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


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                // location.reload(true);
                history.push('/login')
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}