import { Injectable } from '@angular/core'
import { Headers, Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

import { Person } from '../models/person';

import { getLS, saveLS } from './local.service';

@Injectable()
export class PersonService {
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
  getPersons(): Promise<any> {
    if (this.local) {
      let persons = getLS('ngpersons');
      persons.forEach( (v,i) => {
        persons[i] = new Person(v);
      });
      return Promise.resolve(persons);
    } else {
      return this.http.get(`${this.url}/persons/`)
        .toPromise()
        .then((res: Response) => res.json().map(v => new Person(v)))
        .catch((res) => this.handleError(res));
    }
  }

  getPerson(id: number): Promise<any> {
    if (this.local) {
      let persons = getLS('ngpersons');
      // id's are 1 indexed.
      let idx = persons.findIndex((v) => v.id === id);
      if (idx === -1) {
        return Promise.resolve({status_code: 404, status_message: 'No person found'});
      }
      return Promise.resolve(persons[idx]);
    } else {
      return this.http.get(`${this.url}/persons/${id}/`)
        .toPromise()
        .then((res: Response) => res.json())
        .catch((res) => this.handleError(res));
    }
  }

  savePerson(person: Person): Promise<any> {
    if (this.local) {
      let persons = getLS('ngpersons');
      let last_person = 0;
      if (persons.length > 0) {
        last_person = persons[persons.length - 1].id
      }
      person['id'] = last_person + 1;
      persons.push(person);
      saveLS('ngpersons', persons);
      return Promise.resolve(persons);
    } else {
      return this.http.put(`${this.url}/persons/`, JSON.stringify(person), {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(res => this.handleError(res))
    }
  }

  updatePaymentsMade(val: number, id: number): Promise<any> {
    if (this.local) {
      let persons = getLS('ngpersons');
      let idx = persons.findIndex((v) => v.id === id);
      persons[idx].payments_made += val;
      saveLS('ngpersons', persons);
      return Promise.resolve(persons);
    } else {
      return this.http.put(`${this.url}/persons/${id}`, JSON.stringify(val), {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(res => this.handleError(res));
    }
  }
  
  deletePerson(id: number): Promise<any> {
    if (this.local) {
      let persons = getLS('ngpersons');
      let idx = persons.findIndex((v) => v.id === id);
      persons.splice(id, 1);
      saveLS('ngpersons', persons);
      return Promise.resolve(id);
    } else {
      return this.http.delete(`${this.url}/persons/${id}`)
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
export class PersonResolver implements Resolve<any> {
  constructor(
    private personService: PersonService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return this.personService.getPersons();
  }
}
