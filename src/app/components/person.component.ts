import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { Person } from '../models/person';
import { BillService } from '../services/bill.service';
import { PersonService } from '../services/person.service';

@Component({
  moduleId: module.id,
  selector: 'person-cmp',
  template: `
    <h3>Roommates</h3>
    <div class="add-person">
      <span *ngIf="no_name" class="alert">
        No name entered
      </span>
      <input #personName type="text" placeholder="Person's name" 
        (keyup.enter)="addPerson(personName.value); personName.value=''">
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

@Component({
  moduleId: module.id,
  selector: 'person-detail-cmp',
  template: `
    <div class="person-details">
      <h3>{{ person?.name }}</h3>
      <span class="total-paid">
        {{ person?.payments_made | currency:USD }}
      </span>
    </div>
    <div class="active-bills" *ngIf="bills">
      <h4>Currently Unpaid Bills</h4>
      <div *ngFor="let bill of bills" class="bill-detail">
        <bill-detail-inline-cmp [bill]="bill">
        </bill-detail-inline-cmp>
      </div>
    </div>
  `,
  styles: []
})

export class PersonDetailComponent implements OnInit {
  private id: number;
  private person: Person;
  private bills: Bill[];
  private totalPaid: number = 0.0;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private billService: BillService,
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.getPerson();
    this.getActiveBills();
  }

  getPerson(): void {
    this.personService.getPerson(this.id).then(
      res => {
        this.person = res;
      });
  }

  getActiveBills(): void {
    this.billService.getBills().then(
      res => {
        this.bills = res.filter(
          v => v.split_by_ids.includes(this.id)
        )
      });
  }
}
