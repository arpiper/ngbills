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
  redirect;

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
      .then(res => res)
      .catch(res => this.handleError(res));
  }

  logout(): Promise<any> {
    return this.http.get(`${this.url}/logout`, this.options)
      .toPromise()
      .then(res => res);
  }

  isAuthenticated() {
    this.http.get(`${this.url}/auth`, this.options)
      .toPromise()
      .then(res => {
        console.log('isAuth', res);
        return res;
      });
    return true;
  }
  
  handleError(error: any): Promise<any> {
    console.log(error);
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
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.authService.redirect = url;
    this.router.navigate(['/login']);
    return false;
  }
}
