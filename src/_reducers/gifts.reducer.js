import { giftConstants } from '../_constants';

export function gifts(state = {}, action) {
    switch (action.type) {
        case giftConstants.REQUEST:
            return {
                ...state,
                error: false,
                loading: true
            };
        case giftConstants.REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        case giftConstants.GET_ALL_SUCCESS:
            console.log('GET_ALL_SUCCESS', action)
            return {
                ...state,
                error: false,
                loading: false,
                items: action.gifts.records,
                total: action.gifts.total
            }
        case giftConstants.CREATE_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false
            }
        case giftConstants.UPDATE_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false
            }
        case giftConstants.DELETE_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false
            }
        default:
            return state
    }
}