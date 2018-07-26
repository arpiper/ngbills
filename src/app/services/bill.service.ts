import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { Person } from '../models/person';

import { getLS, saveLS } from './local.service';

@Injectable()
export class BillService {
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
  getBills(): Promise<any> {
    if (this.local) {
      let bills = getLS('ngbills');
      bills.forEach( (v,i) => {
        bills[i] = new Bill(v);
      });
      return Promise.resolve(bills);
    } else {
      return this.http.get(`${this.url}/bills/`, {headers: this.headers})
        .toPromise()
        .then((res: Response) => {
            return res.json();
            //.map(v => new Bill(v));
          })
        .catch((res) => this.handleError(res));
    }
  }

  getBill(id: number | string): Promise<any> {
    if (this.local && typeof(id) === 'number') {
      let bills = getLS('ngbills');
      // id's are 1 indexed.
      let idx = bills.findIndex((v) => v.id === id);
      if (idx === -1) {
        return Promise.resolve({status_code: 404, status_message: 'Bill not found'});
      }
      return Promise.resolve(bills[idx]);
    } else {
      return this.http.get(`${this.url}/bills/${id}/`, {headers: this.headers})
        .toPromise()
        .then((res: Response) => res.json())
        .catch((res) => this.handleError(res));
    }
  }

  saveBill(bill: Bill): Promise<any> {
    if (this.local) {
      let bills = getLS('ngbills');
      let last_bill = 0;
      if (bills.length > 0) {
        last_bill = bills[bills.length - 1].id;
      }
      bill['id'] = last_bill + 1;
      bills.push(bill);
      saveLS('ngbills', bills);
      return Promise.resolve(bill);
    } else {
      return this.http.post(`${this.url}/bills/`, JSON.stringify(bill), {headers: this.headers})
        .toPromise()
        .then((res) => res.json())
        .catch((res) => this.handleError(res))
    }
  }

  updateBill(bill: Bill): Promise<any> {
    if (this.local) {
      let bills = getLS('ngbills');
      let idx = bills.findIndex((v) => v.id === bill.id);
      bills[idx] = bill;
      saveLS('ngbills', bills);
      return Promise.resolve(bills);
    } else {
      return this.http.put(`${this.url}/bills/${bill.id}`, JSON.stringify(bill), {headers: this.headers})
        .toPromise()
        .then((res) => res.json())
        .catch((res) => this.handleError(res));
    }
  }

  deleteBill(id: number): Promise<any> {
    if (this.local) {
      let bills = getLS('ngbills');
      let idx = bills.findIndex((v) => v.id === id);
      bills.splice(idx, 1);
      saveLS('ngbills', bills);
      return Promise.resolve(id);
    } else {
      return this.http.delete(`${this.url}/bills/${id}`)
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
