import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { coupons } from './coupons.reducer';
import { couponGroups } from './couponGroups.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
    authentication,
    registration,
    users,
    coupons,
    alert,
    couponGroups,
});

export default rootReducer;