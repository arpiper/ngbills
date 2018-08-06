import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
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
  
  constructor(
    @Inject(DOCUMENT) private doc: any
  ) {}

  getToken(): string|null {
    const cookieString = '';
    console.log('cookeiname',this.doc.cookie);
    console.log('cookeiname',document.cookie);
    if (cookieString !== this.lastCookieString) {
      //this.lastToken = ;
      this.lastCookieString = cookieString;
    }
    return this.lastToken;

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
    console.log('token', token);
    console.log('header', req.headers);
    if (token !== null && !req.headers.has(headerName)) {
      req = req.clone({ headers: req.headers.set(headerName, token)});
    }

    return next.handle(req);
  }

}
