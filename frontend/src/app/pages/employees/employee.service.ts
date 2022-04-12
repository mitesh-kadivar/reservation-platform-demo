import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  headers: any;
  avatar$: BehaviorSubject<any>;
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.avatar$ = new BehaviorSubject({
      name: "",
      image: ""
    });
  }

  getAvatar() {
    return this.avatar$.asObservable();
  }

  setAvatar(value: any) {
    this.avatar$.next(value);
  }

  changePassword(postParameter:any) {
    // let headers = new HttpHeaders()
    // let token = this.authService.getBearerToken();
    // headers = headers.append('Authorization', token)
    this.headers = this.getHeaderData();
    return this.httpClient.post<any>(environment.baseURL+`change-password`, postParameter,{'headers':this.headers});
  }

  createEmployee(employee: Employee) : Observable<Employee> {
    this.headers = this.getHeaderData();
    this.headers = this.headers.append('Content-Type', 'multipart/form-data');
    this.headers = this.headers.append('Accept', 'application/json');
    return this.httpClient.post<Employee>(environment.baseURL + `employees/add`, employee, {'headers': this.headers})
  }

  getHeaderData() {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    // let headers = new HttpHeaders()
    let token = this.authService.getBearerToken();
    this.headers = this.headers.append('Authorization', token);
    return this.headers;
  }

  getAllEmployees() : Observable<Employee[]> {
    this.headers = this.getHeaderData();
    return this.httpClient.get<Employee[]>(environment.baseURL + `employees/get`, {'headers':this.headers});
  }

  deleteEmployee(id: number): Observable<Employee> {
    this.headers = this.getHeaderData();
    return this.httpClient.delete<Employee>(environment.baseURL + `employees/delete/` + id, {'headers':this.headers});
  }

  find(id: number): Observable<Employee> {
    this.headers = this.getHeaderData();
    return this.httpClient.get<Employee>(environment.baseURL + 'employees/edit/' + id, {'headers':this.headers})
  }

  update(id: number, employee: Employee): Observable<Employee> {
    this.headers = this.getHeaderData();
    return this.httpClient.put<Employee>(environment.baseURL + 'employees/update/' + id, employee, {'headers':this.headers})
  }

  profileUpdate(id: number, employee: any) {
    this.headers = this.getHeaderData();
    return this.httpClient.put(environment.baseURL + 'employees/profile-update/' + id, employee, {'headers':this.headers})
  }
}
