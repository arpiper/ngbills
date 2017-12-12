import { Component, OnInit } from '@angular/core';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { Person } from '../models/person';
import { PersonService } from '../services/person.service';

@Component({
  moduleId: module.id,
  selector: 'person-cmp',
  template: `
    <h3>Persons</h3>
    <div class="add-person">
      <span *ngIf="no_name" class="alert">
        No name entered
      </span>
      <input #personName type="text" placeholder="Person's name">
      <button (click)="addPerson(personName.value); personName.value=''" >Add Person</button>
    </div>
    <div class="persons">
      <div *ngFor="let person of persons">
        {{ person.name }}
      </div>
    </div>
  `,
  styles: [`
    .alert {
      color: red;
    }
    .alert + input:focus {
      outline-color: red;
    }
  `],
})

export class PersonComponent implements OnInit {
  private addPersonValue: Person;
  private persons: Person[];
  private no_name: boolean = false;

  constructor(
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.personService.getPersons().then( (res) => {
      console.log(res);
      this.persons = res;
    });
    this.addPersonValue = new Person();
  }

  addPerson(name: string): void {
    console.log(this.addPersonValue);
    if (name !== 0) {
      this.personService.savePerson(p);
      this.no_name = false;
    }
    this.no_name = true;
  }
}
