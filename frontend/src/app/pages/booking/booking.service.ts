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

  checkResourceBooked(postData: any) {
    this.headers = this.getHeaderData();
    return this.httpClient.post<any>(environment.baseURL+`booking/resource-booked`, postData,{'headers':this.headers});
  }

  getBookingOrders() {
    this.headers = this.getHeaderData();
    return this.httpClient.get(environment.baseURL + `booking/list`, {'headers':this.headers});
  }

  cancelOrder(id: number) {
    this.headers = this.getHeaderData();
    return this.httpClient.delete(environment.baseURL + `booking/cancel/` + id, {'headers':this.headers});
  }

  getOrderHistory() {
    this.headers = this.getHeaderData();
    return this.httpClient.get(environment.baseURL + `booking/order-history`, {'headers':this.headers});
  }

  getHeaderData() {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    let token    = this.authService.getBearerToken();
    this.headers = this.headers.append('Authorization', token);
    return this.headers;
  }
}
