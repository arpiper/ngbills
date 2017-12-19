import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Bill } from '../models/bill';
import { BillService } from '../services/bill.service';

@Component({
  moduleId: module.id,
  selector: 'bill-detail-inline-cmp',
  template: `
    <div class="bill-details">
      <a routerLink="/bills/{{ bill.id }}">
        <span class="paid-to">
          {{ bill.paid_to.name }}
        </span>
        <span class="amount">
          {{ bill.amount | currency:USD }}
        </span>
        <span class="due-date">
          {{ bill.due_date }}
        </span>
      </a>
    </div>
  `,
  styles: [`
    .bill-details {
      display: flex;
      width: 100%;
    }
    .bill-details a {
      display: flex;
      width: 100%;
      color: #333;
    }
  `],
})

export class BillDetailInlineComponent implements OnInit {
  @Input() bill: Bill;

  ngOnInit(): void {
  }
}


@Component({
  moduleId: module.id,
  selector: 'bill-detail-cmp',
  template: `
    <div class="bill-details">
      <div class="paid-to">
        <a routerLink="/utilities/{{ bill?.paid_to.id }}"> 
          {{ bill?.paid_to.name | titlecase }}
        </a>
      </div>
      <div class="amount">
        {{ bill?.amount | currency:USD }}
      </div>
      <div class="split-by">
        <span *ngFor="let person of bill?.split_by">
          <a routerLink="/person/{{ person.id }}">
            {{ person.name }}
          </a>
        </span>
      </div>
    </div>
  `,
  styles: []
})

export class BillDetailComponent implements OnInit {
  private bill: Bill;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billService: BillService,
  ) {}

  ngOnInit(): void {
    this.getBill();
  }

  getBill(): void {
    let id = +this.route.snapshot.paramMap.get('id');
    this.billService.getBill(id).then(
      res => {
        if (res.status_code === 404) {
          this.router.navigate(['/404']);
        }
        this.bill = res;
      });
  }
}
