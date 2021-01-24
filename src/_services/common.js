import config from 'config';
import { authHeader, history } from '../_helpers';

export const common = {
    logout,
    handleResponse
}
function logout() {
    // remove coupon from local storage to log coupon out
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
    };
    fetch(`${config.apiUrl}/auth/logout`, requestOptions)
        .then(() => {
            console.log('logout');
        });
    localStorage.removeItem('coupon');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                history.push('/login')
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}