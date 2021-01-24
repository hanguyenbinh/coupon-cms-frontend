import config from 'config';
import { authHeader } from '../_helpers';
import { common } from './common';
// import { getI18n } from "react-i18next";
const handleResponse = common.handleResponse;

export const giftService = {
    getAll,
    createGift,
    updateGift,
    deleteGift,
    redeem
};
function getAll(page = 1) {
    // const lang = getI18n().language || 'en';
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/gifts?page=${page}`, requestOptions)
        .then(handleResponse)
        .then(result => {
            if (result && result.success) {
                return result.data;
            }
            return null;
        });
}
function createGift(gift) {
    // const formData = new FormData();
    // formData.append('defaultName', defaultName);
    // formData.append('couponExchangeRate', couponExchangeRate);
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(gift)
    };

    return fetch(`${config.apiUrl}/gifts`, requestOptions)
        .then(handleResponse)
        .then(result => {
            return result;
        });
}
function updateGift(giftId, newData) {    
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
    };

    return fetch(`${config.apiUrl}/gifts/${giftId}`, requestOptions)
        .then(handleResponse)
        .then(result => {
            return result;
        });
}
function deleteGift(giftId) {    
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/gifts/${giftId}`, requestOptions)
        .then(handleResponse)
        .then(result => {
            return result;
        });
}

function redeem(giftId, coupons){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({coupons})
    };

    return fetch(`${config.apiUrl}/gifts/${giftId}/redeem`, requestOptions)
        .then(handleResponse)
        .then(result => {
            return result;
        });
}