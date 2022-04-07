import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  headers: any;
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  resourceBook(postData: any) {
    this.headers = this.getHeaderData();
    return this.httpClient.post<any>(environment.baseURL+`booking/add`, postData,{'headers':this.headers});
  }

  getHeaderData() {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    let token    = this.authService.getBearerToken();
    this.headers = this.headers.append('Authorization', token);
    return this.headers;
  }
}
