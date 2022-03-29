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

  logout() {
    localStorage.removeItem('auth_app_token');
  }
}
