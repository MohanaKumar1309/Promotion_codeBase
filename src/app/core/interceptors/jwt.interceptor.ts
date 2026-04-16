import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('[JwtInterceptor] Processing request:', request.method, request.url);
    
    const token = this.authService.getToken();
    console.log('[JwtInterceptor] Token retrieved:', token ? 'YES - ' + token.substring(0, 20) + '...' : 'NO');

    if (token) {
      console.log('[JwtInterceptor] Adding Authorization header with Bearer token');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[JwtInterceptor] Request cloned with Authorization header');
    } else {
      console.log('[JwtInterceptor] No token found - request will be sent without Authorization header');
    }

    return next.handle(request);
  }
}
