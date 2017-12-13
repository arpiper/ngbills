import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { Person } from '../models/person';

import { BillService } from '../services/bill.service';
import { UtilityService } from '../services/utility.service';
import { PersonService } from '../services/person.service';

@Component({
  moduleId: module.id,
  selector: 'bill-form',
  template:`
    <h5>form</h5>
    <form [formGroup]="billForm" (ngSubmit)="save(myForm.value, myForm.valid)">
      <div class="form-group">
        <label>Due Date:
          <input class="form-control" formControlName="due_date">
        </label>
      </div>
      <div class="form-group">
        <label>Amount:
          <input class="form-control" formControlName="amount">
        </label>
      </div>
      <div class="form-group">
        <label>Utility:
          <select class="form-control" formControlName="paid_to">
            <option *ngFor="let utility of paid_to" [value]="utility">{{ utility.name | uppercase }}</option>
          </select>
        </label>
      </div>
      <div class="form-group">
        <label>Roommates:
          <select class="form-control" formControlName="split_by">
            <option *ngFor="let person of split_by" [value]="person">{{ person.name | uppercase }}</option>
          </select>
        </label>
      </div>
      <div class="form-group">
        <label>Notes:
          <input class="form-control" formControlName="notes">
        </label>
      </div>
      <button>Submit</button>
    </form>
  `,
})

export class BillFormComponent implements OnInit {
  private utilities: Utility[];
  private persons: Person[];
  private model: Bill;
  private billForm: FormGroup;

  constructor(
    private billService: BillService,
    private utilityService: UtilityService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        this.utilities = data.utilities;
        this.persons = data.persons;
        this.createForm(); 
      }
    );
  }

  createForm(): void {
    this.billForm = this.fb.group({
      due_date: new Date(),//new FormControl(),
      amount: 0, //new FormControl(),
      paid_to: this.utilities, //new FormControl(),
      split_by: this.persons, //new FormControl(),
      notes: '', //new FormControl(),
    });
  }

  save(value, valid): void {
    console.log("value", value);
    console.log("valid", valid);
  }
}
