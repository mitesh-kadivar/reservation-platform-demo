import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken    = this.authService.getBearerToken();
    const isAuthenticate = this.authService.isLoggedIn();

    // set token in header if authenticated
    if (isAuthenticate) {
      request = request.clone({
        setHeaders: {
            Authorization: accessToken
        }
      });
    }

    return next.handle(request);
  }
}
