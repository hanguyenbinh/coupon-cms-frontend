import { giftConstants } from '../_constants';
import { giftService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const giftActions = {
    getAll,
    createGift,
    updateGift,
    deleteGift,
    redeem
};

function getAll(page=1){
    return dispatch => {
        dispatch(request());
        giftService.getAll(page)
            .then(
                (gifts) => { 
                    dispatch(success(gifts));                    
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: giftConstants.REQUEST } }
    function success(gifts) { return { type: giftConstants.GET_ALL_SUCCESS, gifts } }
    function failure(error) { return { type: giftConstants.REQUEST_FAILURE, error } }
}

function createGift(gift) {
    return dispatch => {
        dispatch(request());
        giftService.createGift(gift)
            .then(
                () => { 
                    dispatch(success());
                    history.go(0);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: giftConstants.REQUEST } }
    function success() { return { type: giftConstants.CREATE_SUCCESS } }
    function failure(error) { return { type: giftConstants.REQUEST_FAILURE, error } }
}

function updateGift(giftId, newData) {
    return dispatch => {
        dispatch(request());
        giftService.updateGift(giftId, newData)
            .then(
                () => { 
                    dispatch(success());
                    history.go(0);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: giftConstants.REQUEST } }
    function success() { return { type: giftConstants.UPDATE_SUCCESS } }
    function failure(error) { return { type: giftConstants.REQUEST_FAILURE, error } }
}

function deleteGift(giftId) {
    return dispatch => {
        dispatch(request());
        giftService.deleteGift(giftId)
            .then(
                () => { 
                    dispatch(success());
                    history.go(0);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: giftConstants.REQUEST } }
    function success() { return { type: giftConstants.DELETE_SUCCESS } }
    function failure(error) { return { type: giftConstants.REQUEST_FAILURE, error } }
}

function redeem(giftId, coupons){
    return dispatch => {
        dispatch(request());
        giftService.redeem(giftId, coupons)
            .then(
                () => { 
                    dispatch(success());
                    // history.go(0);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: giftConstants.REQUEST } }
    function success() { return { type: giftConstants.REDEEM_SUCCESS } }
    function failure(error) { return { type: giftConstants.REQUEST_FAILURE, error } }
}