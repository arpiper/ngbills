import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

import { 
  CanActivate, 
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
  public redirect;
  public authenticated: boolean = false;

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
        this.authenticated = response.status === 200;
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
   * check/refresh the cookie
   */
  isAuthenticated(): Observable<any> {
    return this.http.get(`${this.url}/auth`, this.options);
      .toPromise()
      .then(response => {
        this.authenticated = response.status === 200;
        return response['status'];
      })
      .catch(response => this.handleError(response));
  }
  
  handleError(error: any): Promise<any> {
    console.log("ERROR", error);
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( 
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('auth guard encountered');
    let url: string = state.url;
    let isAuth= this.checkAuthentication(url);
    return isAuth;
  }

  checkAuthentication(url: string): boolean {
    if (this.authService.authenticated) {
      return true;
    }
    this.authService.redirect = url;
    this.router.navigate(['/login']);
    return false;
  }
}
