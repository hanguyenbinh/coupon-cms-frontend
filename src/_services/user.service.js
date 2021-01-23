import config from 'config';
import { authHeader, history } from '../_helpers';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};

function login(username, password) {
    console.log('user.login');
    const formData = new FormData();
    formData.append('email', username);
    formData.append('password', password);
    const requestOptions = {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: formData
    };

    return fetch(`${config.apiUrl}/auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
    };
    fetch(`${config.apiUrl}/auth/logout`, requestOptions)
        .then(handleResponse)
        .then(user => {
            console.log('logout');
        });
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    // return fetch(`${config.apiUrl}/auth`, requestOptions).then(handleResponse);
    return [];
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/auth/user`, requestOptions).then(handleResponse);    
}

function register(user) {
    console.log('user.register', user)
    const formData = new FormData();
    formData.append('email', user.username);
    formData.append('password', user.password);
    formData.append('password_confirmation', user.password_confirmation);
    formData.append('name', user.name);
    const requestOptions = {
        method: 'POST',
        body: formData
    };

    return fetch(`${config.apiUrl}/auth/register`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    // return fetch(`${config.apiUrl}/auth/${user.id}`, requestOptions).then(handleResponse);;
    return null;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    // return fetch(`${config.apiUrl}/auth/${id}`, requestOptions).then(handleResponse);
    return null;
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                // logout();
                // location.reload(true);
                history.push('/login');
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}