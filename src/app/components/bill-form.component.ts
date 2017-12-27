import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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
    <div class="form-container" [ngStyle]="formPosition" #container>
      <h3>Add New Bill</h3>
      <form [formGroup]="billForm" (ngSubmit)="saveBill()" (keyup.enter)="submit">
        <div class="form-group due-date">
          <label>Due Date:
            <date-picker 
              [extraClass]="'test'" 
              [name]="'due_date'"
              (datePicked)="datePicked($event)">
            </date-picker>
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
            <div class="split-by-checkboxes" *ngFor="let person of personsArray.controls">
              <input type="checkbox"  formControlName="split_by" [id]="person.value.name" value="person.value.id">
              <label [for]="person.value.name" >{{ person.value.name | uppercase }}</label>
            </div>
            <!--select multiple class="form-control" formControlName="split_by" ngModel>
              <option *ngFor="let person of persons" [value]="person.id">{{ person.name | uppercase }}</option>
            </select-->
          </label>
        </div>
        <div class="form-group notes">
          <label>Notes:
            <textarea class="form-control" formControlName="notes" rows="5">
            </textarea>
          </label>
        </div>
        <div class="buttons">
          <button (click)="cancel()">Cancel</button>
          <button (click)="sumbit">Submit</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0,0,0,0.5);
    }
    .form-container {
      width: auto;
      height: auto;
      position: absolute;
      background-color: var(--color-gray-light);
      padding: 25px;
    }
    .form-container h3 {
      margin-top: 0;
      text-decoration: underline;
    }
    .form-container form {
    }
    .form-group,
    .form-control,
    label {
      width: 100%;
    }
    .buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  `]
})

export class BillFormComponent implements OnInit {
  private utilities: Utility[];
  private persons: Person[];
  private model: Bill;
  private billForm: FormGroup;
  private personsArray: FormArray;
  private formPosition: {};
  @Output() addedBill: EventEmitter<any> = new EventEmitter();
  @ViewChild('container') private container: ElementRef;

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
    this.setPosition();
  }

  createForm(): void {
    this.personsArray = this.fb.array(this.persons.map((v) => {
      return this.fb.control(v);
    }));
    this.billForm = this.fb.group({
      due_date: [new Date().toLocaleDateString(), Validators.required],
      amount: [0, Validators.required], 
      paid_to: [Utility, Validators.required],
      split_by: [this.personsArray, Validators.required],
      notes: '',
    });
    console.log(this.billForm);
    console.log(this.personsArray);
  }

  datePicked(d): void {
    console.log(d);
  }

  prepareSaveBill(): Bill {
    let bf = this.billForm.value;
    let u_id = this.utilities.findIndex((v) => v.id === +bf.paid_to);
    console.log(bf.split_by);
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

  cancel(): void {
    this.addedBill.emit(false);
  }

  setPosition(): void {
    console.log(this.container);
    let h = this.container.nativeElement.offsetHeight;
    let w = this.container.nativeElement.offsetWidth;
    h = (this.container.nativeElement.parentElement.offsetHeight / 2) - (h / 2);
    w = (this.container.nativeElement.parentElement.offsetWidth / 2) - (w / 2);
    this.formPosition = {
      top: `${h}px`,
      left: `${w}px`,
    };
  }
}
