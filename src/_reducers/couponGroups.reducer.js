import { couponConstants } from '../_constants';


export function couponGroups(state = {}, action) {
    console.log('couponGroups')
    switch (action.type) {
        case couponConstants.GETALLGROUPS_REQUEST:
            return {
                ...state,
                error: false,
                loading: true
            };
        case couponConstants.GETALLGROUPS_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false,
                items: action.couponGroups.records,
                total: action.couponGroups.total
            }
        case couponConstants.GETALLGROUPS_FAILURE:
            return {
                ...state,                
                loading: false,
                error: action.error
            };
        
        case couponConstants.GET_COUPONS_IN_GROUP_REQUEST:
            return {
                ...state,
                error: false,                
                loading: true
            };
        case couponConstants.GET_COUPONS_IN_GROUP_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false,
                coupons: action.coupons.records,
                couponTotal: action.coupons.total
            }
        case couponConstants.GET_COUPONS_IN_GROUP_FAILURE:
            return {
                ...state,                
                loading: false,
                error: action.error
            };
        default:
            return state
    }
}