import { Injectable } from '@angular/core'
import { Headers, Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

import { Utility } from '../models/utility';

import { getLS, saveLS } from './local.service';

@Injectable()
export class UtilityService {
  private url;
  private local = true;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http
  ) {
    if (environment.api.url !== '') {
      this.local = false;
      this.url = environment.api.url; // api key
    }
  }
  getUtilities(): Promise<any> {
    if (this.local) {
      let utils = getLS('ngutilities');
      utils.forEach( (v,i) => {
        utils[i] = new Utility(v);
      });
      return Promise.resolve(utils);
    } else {
      return this.http.get(`${this.url}/utilities/`)
        .toPromise()
        .then((res: Response) => res.json().map(v => new Utility(v)))
        .catch((res) => this.handleError(res));
    }
  }

  getUtility(id: number): Promise<any> {
    if (this.local) {
      let utils = getLS('ngutilities');
      // id's are 1 indexed.
      let u = ((id - 1) < utils.length) ? utils[id - 1] : undefined;
      if (u) {
        u = new Utility(u);
      } else { 
        u = {status_code: 404, status_message: 'Utility not found'};
      }
      return Promise.resolve(u);
    } else {
      return this.http.get(`${this.url}/utilities/${id}/`)
        .toPromise()
        .then((res: Response) => res.json())
        .catch((res) => this.handleError(res));
    }
  }

  saveUtility(utility: Utility): Promise<any> {
    if (this.local) {
      let utils = getLS('ngutilities');
      // id's are 1 indexed.
      utility['id'] = utils.length + 1;
      utils.push(utility);
      saveLS('ngutilities', utils);
      return Promise.resolve(utility);
    } else {
      return this.http.put(`${this.url}/utilities/`, JSON.stringify(utility), {headers: this.headers})
        .toPromise()
        .then((res) => res.json())
        .catch((res) => this.handleError(res))
    }
  }

  //updatePaymentsMade(val: number, id: number): Promise<any> {
  //}
  
  deleteUtility(id: number): Promise<any> {
    if (this.local) {
      let utils = getLS('ngutilities');
      utils.splice(1, (id - 1));
      saveLS('ngutilities', utils);
      return Promise.resolve(id);
    } else {
      return this.http.delete(`${this.url}/utilities/${id}`)
        .toPromise()
        .then((res) => res.json())
        .catch((res) => this.handleError(res));
    }
  }

  handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }
}

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class UtilityResolver implements Resolve<any> {
  constructor(
    private utilityService: UtilityService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return this.utilityService.getUtilities();
  }
}
