import { couponConstants } from '../_constants';


export function coupons(state = {}, action) {
    console.log(state);
    switch (action.type) {
        case couponConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case couponConstants.GETALL_SUCCESS:
            return {
                items: action.coupons,
                couponGroups: state.couponGroups
            }
        case couponConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        
        default:
            return state
    }
}