import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, filter, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  includeTokenCookie(req: HttpRequest<any>): HttpRequest<any> {
    // ensure the request is using the credentials
    if (!req.withCredentials) {
      req = req.clone({withCredentials: true});
    }
    return req;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.includeTokenCookie(req)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          console.log("authinterceptor", error);
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              return this.handle400Error(error);
            case 401:
              return this.handle401Error(req, next);
          }
        } else { 
          return Observable.throw(error);
        }
      }));
  }

  handle400Error(error) {
    console.log('handel 400', error);
    return this.logoutUser();
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here to that the following request wait until the token returns from refresh call.
      this.tokenSubject.next(null);
      console.log('auth interceptor - handle 401');
      return this.authService.refreshToken()
        .switchMap((newToken: string) => {
          if (newToken) {
            this.tokenSubject.next(newToken);
            return next.handle(this.includeTokenCookie(req));
          }
          // if we don'e get a new token, logout
          return this.logoutUser();
        })
        .catch(error => {
          // exception when calling refreshToken, logout
          return this.logoutUser();
        })
        .finally(() => {
          this.isRefreshingToken = false;
        });
      } else {
        return this.tokenSubject
          .filter(token => token != null)
          .take(1)
          .switchMap(token => {
            return next.handle(this.includeTokenCookie(req));
          });
      }
  }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['/login']);
    return Observable.throw("");
  }
}
