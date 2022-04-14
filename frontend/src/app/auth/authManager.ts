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

export const changeFormater = (date) => {

    let year   = date.getFullYear();
    let month  = date.getMonth()+1;
    let day    = date.getDate();
    let hours  = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    let dateTime = year+"-"+month+"-"+day+" "+hours+":"+minute+":"+second;

    return dateTime;

    // let selectedDateTime = date.split('T');
    // selectedDateTime[1] += ":00";

    // let orignalDateTime = selectedDateTime[0] +' '+ selectedDateTime[1];
    // return orignalDateTime;
}
