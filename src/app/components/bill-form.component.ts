import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { Person } from '../models/person';

import { BillService } from '../services/bill.service';
import { UtilityService } from '../services/utility.service';
import { PersonService } from '../services/person.service';

import { DatePicker } from '../components/date-picker.component';

@Component({
  moduleId: module.id,
  selector: 'bill-form',
  template:`
    <div class="form-container">
      <form [formGroup]="billForm" (ngSubmit)="saveBill()" (keyup.enter)="submit">
        <div class="form-group due-date">
          <label>Due Date:
            <input class="form-control" formControlName="due_date">
            <date-picker [extraClass]="TEst" (datePicked)="datePicked($event)"></date-picker>
          </label>
        </div>
        <div class="form-group amount">
          <label>Amount:
            <input type="number" class="form-control" formControlName="amount">
          </label>
        </div>
        <div class="form-group paid-to">
          <label>Utility:
            <select class="form-control" formControlName="paid_to">
              <option *ngFor="let utility of utilities" [value]="utility.id">{{ utility.name | uppercase }}</option>
            </select>
          </label>
        </div>
        <div class="form-group split-by">
          <label>Roommates:
            <select multiple class="form-control" formControlName="split_by" ngModel>
              <option *ngFor="let person of persons" [value]="person.id">{{ person.name | uppercase }}</option>
            </select>
          </label>
        </div>
        <div class="form-group notes">
          <label>Notes:
            <input class="form-control" formControlName="notes">
          </label>
        </div>
        <button>Submit</button>
      </form>
    </div>
  `,
})

export class BillFormComponent implements OnInit {
  private utilities: Utility[];
  private persons: Person[];
  private model: Bill;
  private billForm: FormGroup;
  @Output() addedBill: EventEmitter<any> = new EventEmitter();

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
      due_date: [new Date().toLocaleDateString(), Validators.required],
      amount: [0, Validators.required], 
      paid_to: [Utility, Validators.required],
      split_by: [Person, Validators.required], 
      notes: '',
    });
  }

  datePicked(d): void {
    console.log(d);
  }

  prepareSaveBill(): Bill {
    let bf = this.billForm.value;
    let u_id = this.utilities.findIndex((v) => v.id === +bf.paid_to);
    let p = bf.split_by.map((v) => {
      let p_id = this.persons.findIndex(v2 => v2.id === v);
      return this.persons[p_id];
    });
    let b = new Bill({
      due_date: this.billForm.value.due_date,
      amount: +this.billForm.value.amount,
      paid_to: this.utilities[u_id],
      split_by: p,
      notes: this.billForm.value.notes,
    });
    return b;
  }

  saveBill(): void {
    console.log("bill", this.billForm);
    if (this.billForm.valid) {
      let b = this.prepareSaveBill();
      b.split_by_ids.forEach(
        v => this.personService.updatePaymentsMade(b.split_amount, v)
      );
      this.billService.saveBill(b);
      this.addedBill.emit(b);
    }
  }
}
