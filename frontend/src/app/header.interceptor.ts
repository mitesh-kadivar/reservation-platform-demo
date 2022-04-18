import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let params = [];
    request.urlWithParams.split('?')?.[1]?.split('&').forEach(item => params.push(item.split('=')?.[0]));

    if (params.includes('page') && params.includes('perPage')) {
      let token = this.authService.getBearerToken();
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
    }
    return next.handle(request);
  }
}
