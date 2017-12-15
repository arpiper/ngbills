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
    <form [formGroup]="billForm" (ngSubmit)="saveBill()">
      <div class="form-group">
        <label>Due Date:
          <input class="form-control" formControlName="due_date">
        </label>
      </div>
      <div class="form-group">
        <label>Amount:
          <input type="number" class="form-control" formControlName="amount">
        </label>
      </div>
      <div class="form-group">
        <label>Utility:
          <select class="form-control" formControlName="paid_to">
            <option *ngFor="let utility of utilities" [value]="utility.id">{{ utility.name | uppercase }}</option>
          </select>
        </label>
      </div>
      <div class="form-group">
        <label>Roommates:
          <select multiple class="form-control" formControlName="split_by" ngModel>
            <option *ngFor="let person of persons" [value]="person.id">{{ person.name | uppercase }}</option>
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
      due_date: new Date().toLocaleDateString(),
      amount: 0, 
      paid_to: Utility, 
      split_by: Person, 
      notes: '',
    });
  }

  prepareSaveBill(): Bill {
    let bf = this.billForm.value;
    let u_id = this.utilities.findIndex((v) => v.id === +bf.paid_to);
    let p = bf.split_by.map((v) => {
      let p_id = this.persons.findIndex(v2 => v2.id === v);
      return this.persons[p_id];
    });
    console.log(u_id, this.utilities[u_id]);
    let b = new Bill({
      due_date: this.billForm.value.due_date,
      amount: +this.billForm.value.amount,
      paid_to: this.utilities[u_id],
      split_by: p,
      notes: this.billForm.value.notes,
    });
    console.log(b);
    return b;
  }

  saveBill(): void {
    console.log("bill", this.billForm);
    let b = this.prepareSaveBill();
    this.billService.saveBill(b);
  }
}
