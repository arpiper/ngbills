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
    :host {
      display: flex;
      flex: 1 1 100%;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  `]
})

export class HomeComponent implements OnInit {
  bills: Bill[];

  constructor(
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.getActiveBills();
  }

  getActiveBills(): void {
    this.billService.getBills().then(
      (res) => {
        let d = res.data;
        console.log(res.data);
        this.bills = d.bills.map(v => new Bill(v)).filter(v => !v.paid_full);
      });
  }

}
