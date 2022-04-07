export const saveAuthentication = (authentication: any) => {
    localStorage.setItem('user_data', JSON.stringify(authentication));
    localStorage.setItem('auth_app_token', JSON.stringify(authentication.token));
}

export const getAuthenticatedUserData = () => {
    return JSON.parse(localStorage.getItem('user_data'));
}

export const clearUserData = () => {
    return localStorage.removeItem('user_data');
}

export const saveUserData = (userData: any) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
}

export const getUserType = () => {
    let user = JSON.parse(localStorage.getItem('user_data'));
    if (user.is_type == 2) {
        return "USER";
    } else {
        return "ADMIN";
    }
}
