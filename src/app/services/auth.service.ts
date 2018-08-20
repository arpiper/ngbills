import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
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
      .then(response => response)
      .catch(response => this.handleError(response));
  }

  logout(): Promise<any> {
    return this.http.get(`${this.url}/logout`, this.options)
      .toPromise()
      .then(response => response);
  }

  isAuthenticated() {
    return this.http.get(`${this.url}/auth`, this.options)
      .toPromise()
      .then(response => response)
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

    return this.checkAuthentication(url);
  }

  checkAuthentication(url: string): boolean {
    let isAuth = false;
    this.authService.isAuthenticated().then(response => {
      console.log('chekc auth', response);
      isAuth = true;
    });
    if (isAuth) {
      return true;
    }
    this.authService.redirect = url;
    this.router.navigate(['/login']);
    return false;
  }
}
