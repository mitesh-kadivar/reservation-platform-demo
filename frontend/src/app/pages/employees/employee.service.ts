import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  changePassword(postParameter:any) {
    let headers = new HttpHeaders()
    let token = this.authService.getBearerToken();
    headers = headers.append('Authorization', token)
    return this.httpClient.post<any>(environment.baseURL+`change-password`, postParameter,{'headers':headers});
  }
}
