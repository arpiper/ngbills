import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private url;
  private options = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

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
  
  handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }
}
