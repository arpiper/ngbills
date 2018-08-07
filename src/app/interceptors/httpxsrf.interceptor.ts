import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class HttpCsrfTokenExtractor {
  private lastCookieString: string = '';
  private lastToken: string|null = null;
  private cookieName: string = 'CSRF-Token';
  
  constructor(
  ) {}

  getToken(): string|null {
    const cookieString = document.cookie;
    if (cookieString !== this.lastCookieString) {
      this.lastToken = this.parseCookie(cookieString, this.cookieName);
      this.lastCookieString = cookieString;
    }
    return this.lastToken;
  }

  parseCookie(cookieString, cookieName): string {
    const cookies = cookieString.split(';');
    let cookie = '';
    cookies.some(v => {
      if (v.split('=')[0].trim() === cookieName) {
        cookie = v.split('=')[1];
        return true;
      }
    });
    return cookie;
  }
}


@Injectable()
export class HttpXsrfInterceptor implements HttpInterceptor {

  constructor(
    private tokenExtractor: HttpCsrfTokenExtractor
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headerName = 'CSRF-Token'
    //const respHeaderName = 'X-CSRF-Token'; 
    let token = this.tokenExtractor.getToken();
    if (token !== null && !req.headers.has(headerName)) {
      req = req.clone({ headers: req.headers.set(headerName, token)});
    }

    console.log(req);
    return next.handle(req);
  }

}
