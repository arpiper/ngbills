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
    <div>
      {{ bills }}
    </div>
  `,
  styles: [],
})

export class BillComponent implements OnInit {
  bills: Bill[];

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
}
