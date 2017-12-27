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
      <div class="add-bill">
        <span>
          <button (click)="addBill()">Add New Bill</button>
        </span>
      </div>
    </div>
    <div *ngIf="bills?.length === 0; then no_bills else list_bills"></div>
    <ng-template #no_bills>
      <p>There are no active bills.</p>
    </ng-template>
    <ng-template #list_bills>
      <div class="bills-list" *ngFor="let bill of bills">
        <bill-detail-inline-cmp [bill]="bill">
        </bill-detail-inline-cmp>
      </div>
    </ng-template>
    <bill-form *ngIf="showForm" (addedBill)="updateBills($event)"></bill-form>
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
    if (bill) {
      this.bills.push(bill);
    }
    this.showForm = false;
  }
}
