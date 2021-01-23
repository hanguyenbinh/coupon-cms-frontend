import { couponConstants } from '../_constants';
import { couponService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const couponActions = {
    initCoupon,
    getCoupons,
    getCouponGroups,
    updateCouponExpiredDate
};

function initCoupon(total, expiredDate){
    return dispatch => {
        dispatch(request());

        couponService.initCoupon(total, expiredDate)
            .then(
                () => { 
                    dispatch(success());
                    // history.push(from);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: couponConstants.INIT_REQUEST } }
    function success() { return { type: couponConstants.INIT_SUCCESS } }
    function failure(error) { return { type: couponConstants.INIT_FAILURE, error } }
}

function getCoupons(page = 1, type='all'){
    return dispatch => {
        dispatch(request());

        couponService.getCoupons(page, type)
            .then(
                (coupons) => { 
                    dispatch(success(coupons));
                    // history.push();
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: couponConstants.GETALL_REQUEST } }
    function success(coupons) { return { type: couponConstants.GETALL_SUCCESS, coupons } }
    function failure(error) { return { type: couponConstants.GETALL_FAILURE, error } }
}


function getCouponGroups(page = 1, type='all'){
    return dispatch => {
        dispatch(request());

        couponService.getCouponGroups(page, type)
            .then(
                (couponGroups) => { 
                    dispatch(success(couponGroups));
                    // history.push();
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: couponConstants.GETALLGROUPS_REQUEST } }
    function success(couponGroups) { return { type: couponConstants.GETALLGROUPS_SUCCESS, couponGroups } }
    function failure(error) { return { type: couponConstants.GETALLGROUPS_FAILURE, error } }
}

function updateCouponExpiredDate(groupId, expiredDate){
    return dispatch => {
        dispatch(request());
        couponService.updateCouponExpiredDate(groupId, expiredDate)
            .then(
                () => { 
                    dispatch(success());
                    // history.push();
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: couponConstants.UPDATE_COUPON_EXPIRED_DATE_REQUEST } }
    function success() { return { type: couponConstants.UPDATE_COUPON_EXPIRED_DATE_SUCCESS} }
    function failure(error) { return { type: couponConstants.UPDATE_COUPON_EXPIRED_DATE_FAILURE, error } }
}

