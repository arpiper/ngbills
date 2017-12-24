import { Component, OnInit } from '@angular/core';
import { Bill } from '../models/bill';
import { BillService } from '../services/bill.service';
import { BillDetailComponent } from './bill-detail.component';

@Component({
  moduleId: module.id,
  selector: 'home-cmp',
  template: `
    <div class="active-bills">
      <div class="bill" *ngFor="let bill of bills">
        <bill-detail-inline-cmp [bill]="bill"></bill-detail-inline-cmp>
      </div>
    </div>
  `,
  styles: [`
    :root {
      display: flex;
      flex: 1 1 100%;
      flex-wrap: wrap;
    }
  `]
})

export class HomeComponent implements OnInit {
  private bills: Bill[];

  constructor(
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.getActiveBills();
  }

  getActiveBills(): void {
    this.billService.getBills().then(
      (res) => {
        this.bills = res.filter(v => !v.paid_full);
      });
  }

}
