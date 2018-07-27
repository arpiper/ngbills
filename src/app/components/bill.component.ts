import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { BillService } from '../services/bill.service';

@Component({
  moduleId: module.id,
  selector: 'bill-cmp',
  template: `
    <div class="bills-header">
      <h3>Bills</h3>
      <bill-btn (click)="addBill()" [button_text]="'Add New Bill'"></bill-btn>
    </div>
    <div *ngIf="unpaid_bills?.length === 0; then no_bills else list_bills"></div>
    <ng-template #no_bills>
      <p>There are no active bills.</p>
    </ng-template>
    <ng-template #list_bills>
      <div class="bills-list" >
        <h3>Currently Unpaid Bills</h3>
        <bill-detail-inline-cmp *ngFor="let bill of unpaid_bills" [bill]="bill">
        </bill-detail-inline-cmp>
      </div>
    </ng-template>
    <div class="bills-list">
      <h3>Paid Bills</h3>
      <bill-detail-inline-cmp *ngFor="let bill of paid_bills" [bill]="bill">
      </bill-detail-inline-cmp>
    </div>
    <!--bill-form *ngIf="showForm" (addedBill)="updateBills($event)" (click)="closeForm($event)"></bill-form-->
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1 0 100%;
      flex-direction: column;
    }
    .bills-header {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
  `],
})

export class BillComponent implements OnInit {
  paid_bills: Bill[] = [];
  unpaid_bills: Bill[] = [];
  showForm: boolean = false;

  constructor(
    private billService: BillService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.paid_bills;
    this.unpaid_bills;
    this.getBills();
  }

  getBills(): void {
    this.billService.getBills().then(
      (res) => {
        //this.bills = bills;
        res.data.bills.forEach((v,i) => {
          if (v.paid_full) {
            this.paid_bills.push(v);
          } else {
            this.unpaid_bills.push(v);
          }
        });
      });
  }

  updateBills(bill): void {
    if (bill) {
      this.unpaid_bills.push(bill);
    }
    this.showForm = false;
  }
  
}
