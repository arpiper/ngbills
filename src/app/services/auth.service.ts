import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/toPromise';

import { 
  CanActivate, 
  CanActivateChild,
  Router, 
  ActivatedRouteSnapshot,
  RouterStateSnapshot 
} from '@angular/router';

@Injectable()
export class AuthService {
  private url;
  private options = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private loginSuccessfulSource = new Subject<string>();
  public loginSuccessful = this.loginSuccessfulSource.asObservable();
  public redirect: string = '/';
  public authenticated: boolean;

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.api.url;
  }

  login(username: string, password: string): Promise<any> {
    let cred = {
      username: username,
      password: password,
    };
    return this.http.post(`${this.url}/login`, cred, this.options)
      .toPromise()
      .then(response => {
        this.loginSuccessfulSource.next('hello');
        this.authenticated = response['status'] === 200;
        return response; 
      })
      .catch(response => this.handleError(response));
  }

  logout(): Promise<any> {
    return this.http.get(`${this.url}/logout`, this.options)
      .toPromise()
      .then(response => {
        this.authenticated = false;
        return response
      })
      .catch(response => this.handleError(response));
  }

  /*
   * Refresh the authentication token/cookie
   */
  refreshToken(): Observable<any> {
    return this.http.get(`${this.url}/refreshToken`, this.options);
  }

  /*
   * check authorization cookie
   */
  isAuthenticated(): Promise<any> {
    return this.http.get(`${this.url}/auth`, this.options)
      .toPromise()
      .then(response => {
        this.authenticated = response['status'] === 200;
        return this.authenticated;
      })
      .catch(response => this.handleError(response));
  }
  
  handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor( 
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    let isAuth = this.checkAuthentication(url);
    console.log('auth guard encountered', isAuth);
    return isAuth;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkAuthentication(url: string) {
    if (this.authService.authenticated) {
      return true
    }
    this.authService.redirect = url;
    this.router.navigate(['/login']);
    return false;
  }
}
