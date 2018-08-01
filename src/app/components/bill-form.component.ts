import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { Person } from '../models/person';

import { BillService } from '../services/bill.service';

import { DatePicker } from '../components/date-picker.component';

@Component({
  moduleId: module.id,
  selector: 'bill-form',
  template:`
    <div class="form-container" [ngStyle]="formPosition" #container>
      <h3>Add New Bill</h3>
      <form [formGroup]="billForm" class="form" (ngSubmit)="onSubmit()">
        <div class="form-group due-date form__group">
          <label class="form__label">Due Date:
            <date-picker 
              [extraClass]="'test'" 
              [name]="'due_date'"
              (datePicked)="datePicked($event)">
            </date-picker>
          </label>
        </div>
        <div class="form-group amount form__group">
          <label class="form__label">Amount:
            <input type="number" class="form-control" formControlName="amount">
          </label>
        </div>
        <div class="form-group paid-to form__group">
          <label>Utility:
            <select class="form-control" formControlName="paid_to">
              <option *ngFor="let utility of utilities" [value]="utility.id">{{ utility.name | uppercase }}</option>
            </select>
          </label>
        </div>
        <div class="form-group split-by form__group">
          <label class="form__label">Roommates:
            <div class="split-by-checkboxes" *ngFor="let person of persons; let i = index" formArrayName="split_by">
              <label>
                <input type="checkbox" [formControlName]="i"  [id]="person.name" [value]="person.id">
                {{ person.name | uppercase }}
              </label>
            </div>
          </label>
        </div>
        <div class="form-group notes form__group">
          <label class="form__label">notes:
            <textarea class="form-control" formControlName="notes" rows="5"></textarea>
          </label>
        </div>
        <div class="form__buttons">
          <button class="button" (click)="cancel()">cancel</button>
          <button class="button">submit</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container h3 {
      margin-top: 0;
      text-decoration: underline;
    }
    .form-container form {
    }
    .form-group {
      padding: 5px;
    }
    .form-group,
    .form-control,
    label {
      width: 100%;
    }
    .split-by-checkboxes label {
      display: inline-block;
      width: 90%;
    }
    .form__buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  `]
})

export class BillFormComponent implements OnInit {
  utilities: Utility[];
  persons: Person[];
  model: Bill;
  billForm: FormGroup;
  personsArray: FormArray;
  formPosition: {};
  @Output() addedBill: EventEmitter<any> = new EventEmitter();
  @ViewChild('container') private container: ElementRef;

  constructor(
    private billService: BillService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.createForm(); 
  }

  createForm(): void {
    this.personsArray = this.fb.array(this.persons.map((v) => {
      return this.fb.control(false);
    }));
    this.billForm = this.fb.group({
      due_date: [new Date().toLocaleDateString(), Validators.required],
      amount: [0, Validators.compose([Validators.min(0.01),Validators.required])], 
      paid_to: [Utility, Validators.required],
      split_by: this.personsArray,
      notes: '',
    });
  }

  // update the bill form with the selected date. mm/dd/yyyy
  datePicked(d): void {
    this.billForm.patchValue({due_date: d.toLocaleDateString()});
  }

  prepareSaveBill(): Bill {
    let bf = this.billForm.value;
    let p = [];
    // the split_by value returns array of booleans. Need the actual person ids.
    bf.split_by.forEach((v, i) => {
      if (v) {
        p.push(this.persons[i]);
      }
    });
    if (p.length === 0) {
      return;
    }
    let b = new Bill({
      due_date: bf.due_date,
      amount: +bf.amount,
      paid_to: bf.paid_to,
      split_by: p,
      notes: bf.notes,
    });
    return b;
  }

  saveBill(): void | boolean {
    if (this.billForm.valid) {
      let b = this.prepareSaveBill();
      if (!b) {
        this.addedBill.emit(false);
        return false;
      }
      this.billService.saveBill(b);
      this.addedBill.emit(b);
    }
  }

  cancel(): void {
    this.addedBill.emit(false);
  }

  onSubmit(): void {
    this.saveBill();
  }
}
