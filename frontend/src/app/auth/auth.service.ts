import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, public router: Router) { }

  redirectUrl: string;

  login = (loginData: any) => {
    return this.httpClient.post<any>(environment.baseURL+`auth/login`, loginData);
  }

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
    const auth_app_token =  JSON.parse(localStorage.getItem('auth_app_token')) || '{}';
    return auth_app_token;
  }

  getBearerToken = () => {
    return 'Bearer ' + this.getAccessToken();
  }

  logout() {
    localStorage.removeItem('auth_app_token');
    localStorage.removeItem('user_data');
  }
}
