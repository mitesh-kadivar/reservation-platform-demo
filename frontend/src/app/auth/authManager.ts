export const saveAuthentication = (authentication: any) => {
    localStorage.setItem('user_data', JSON.stringify(authentication));
    localStorage.setItem('auth_app_token', JSON.stringify(authentication.token));
}