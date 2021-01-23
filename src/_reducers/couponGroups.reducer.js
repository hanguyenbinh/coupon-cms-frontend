import { couponConstants } from '../_constants';


export function couponGroups(state = {}, action) {
    console.log('couponGroups')
    switch (action.type) {        
        case couponConstants.GETALLGROUPS_REQUEST:
            return {
                loading: true
            };
        case couponConstants.GETALLGROUPS_SUCCESS:
            return {
                items: action.couponGroups,
            }
        case couponConstants.GETALLGROUPS_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}