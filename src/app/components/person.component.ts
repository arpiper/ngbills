import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

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
  private addPersonObj: Person;
  private persons: Person[];
  private no_name: boolean = false;
  @ViewChild('personName') private inputEl: ElementRef;

  constructor(
    private personService: PersonService,
  ) {}

  ngOnInit(): void {
    this.getPersons();
    this.addPersonObj = new Person({name: ''});
  }

  addPerson(name: string): void {
    if (name.length !== 0) {
      this.addPersonObj.name = name;
      this.personService.savePerson(this.addPersonObj);
      this.getPersons();
      this.no_name = false;
    } else {
      this.inputEl.nativeElement.focus();
      this.no_name = true;
    }
  }

  getPersons(): void {
    this.personService.getPersons().then( (res) => {
      this.persons = res;
    });
  }
}
