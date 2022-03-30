import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  redirectUrl: string;

  isLoggedIn() {
    if (localStorage.getItem('auth_app_token')) {
      return true;
    }
    return false;
  }

  getauthenticationData() {
    return JSON.parse(localStorage.getItem('auth_app_token') || '{}');
  }

  getAccessToken() {
    const auth_app_token =  JSON.parse(localStorage.getItem('auth_app_token') || '{}');
    return auth_app_token.value;
  }

  getBearerToken = () => {
    return 'Bearer ' + this.getAccessToken();
  }

  logout() {
    localStorage.removeItem('auth_app_token');
  }
}
