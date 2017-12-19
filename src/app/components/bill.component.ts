import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { BillService } from '../services/bill.service';

@Component({
  moduleId: module.id,
  selector: 'bill-cmp',
  template: `
    <h3>Bills</h3>
    <div *ngIf="bills?.length === 0; then no_bills else list_bills"></div>
    <ng-template #no_bills>
      <p>There are no active bills.</p>
    </ng-template>
    <ng-template #list_bills>
      <div *ngFor="let bill of bills">
        <bill-detail-inline-cmp [bill]="bill">
        </bill-detail-inline-cmp>
      </div>
    </ng-template>
    <div class="add-bill">
      <span>
        <button (click)="addBill()">Add New Bill</button>
      </span>
    </div>
    <bill-form *ngIf="showForm" (addedBill)="updateBills($event)"></bill-form>
  `,
  styles: [],
})

export class BillComponent implements OnInit {
  private bills: Bill[];
  private showForm: boolean = false;

  constructor(
    private billService: BillService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.getBills();
  }

  getBills(): void {
    this.billService.getBills().then(
      (bills) => {
        this.bills = bills;
      });
  }

  addBill(): void {
    this.showForm = !this.showForm;
  }
  
  updateBills(bill): void {
    this.bills.push(bill);
    this.showForm = false;
  }
}
