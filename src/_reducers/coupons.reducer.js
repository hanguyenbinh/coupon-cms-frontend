import { couponConstants } from '../_constants';
import { history } from '../_helpers';


export function coupons(state = {}, action) {
    console.log(state);
    switch (action.type) {
        case couponConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case couponConstants.GETALL_SUCCESS:
            return {
                items: action.coupons.records,
                total: action.coupons.total
            }
        case couponConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case couponConstants.INIT_SUCCESS:
            history.go(0);
            return state;
        case couponConstants.INIT_FAILURE:
            return{
                ...state,
                error: action.error
            }        
        default:
            return state
    }
}