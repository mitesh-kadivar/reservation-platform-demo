import { Injectable } from '@angular/core';
import { Resource } from './resource';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  headers: any;
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getHeaderData() {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    let token = this.authService.getBearerToken();
    this.headers = this.headers.append('Authorization', token);
    return this.headers;
  }

  getAllResources() : Observable<Resource[]> {
    this.headers = this.getHeaderData();
    return this.httpClient.get<Resource[]>(environment.baseURL + `resources/list`, {'headers': this.headers});
  }

  getCategories(): Observable<Resource> {
    this.headers = this.getHeaderData();
    return this.httpClient.get<Resource>(environment.baseURL + `resources/categories`, {'headers': this.headers});
  }

  deleteResource(id: number) : Observable<Resource> {
    this.headers = this.getHeaderData();
    return this.httpClient.delete<Resource>(environment.baseURL + `resources/delete/` + id, {'headers': this.headers});
  }

  find(id: number): Observable<Resource> {
    this.headers = this.getHeaderData();
    return this.httpClient.get<Resource>(environment.baseURL + 'resources/edit/' + id, {'headers':this.headers})
  }

  update(resource: Resource): Observable<Resource> {
    this.headers = this.getHeaderData();
    return this.httpClient.post<Resource>(environment.baseURL + 'resources/update', resource, {'headers':this.headers})
  }

  createResource(resource: any): Observable<Resource> {
    this.headers = this.getHeaderData();
    return this.httpClient.post<Resource>(environment.baseURL + 'resources/add', resource, {'headers': this.headers});
  }
}
