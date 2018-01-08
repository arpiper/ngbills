import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Bill } from '../models/bill';
import { Person } from '../models/person';
import { BillService } from '../services/bill.service';

@Component({
  moduleId: module.id,
  selector: 'bill-detail-inline-cmp',
  template: `
    <div class="bill-details">
      <a routerLink="/bills/{{ bill.id }}">
        <div class="left">
          <span class="paid-to">
            <a routerLink="/utility/{{ bill.paid_to.id }}" >
              {{ bill.paid_to.name | titlecase }}
            </a>
          </span>
          <span class="due-date">
            Due: {{ bill.due_date }}
          </span>
        </div>
        <span class="amount right">
          {{ bill.amount | currency:'USD' }}
        </span>
      </a>
    </div>
  `,
  styles: [`
    :host {
      flex: 1;
    }
    .bill-details {
      display: flex;
      flex: 1 1 100%;
      margin: 5px 0;
    }
    .bill-details > a {
      text-decoration: none;
      display: flex;
      background-color: var(--color-gray-light);
      color: var(--color-gray-dark);
      justify-content: space-between;
      padding: 10px;
      width: 100%;
    }
    .bill-details > a:hover {
      background-color: rgba(0,0,0,0.25);
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
        {{ bill?.amount | currency:'USD' }}
      </div>
      <div class="split-by">
        <h4>Split By:</h4>
        <div *ngFor="let person of bill?.split_by">
          <div *ngIf="bill.paid_partial_ids.includes(person.id); then paid else unpaid">
          </div>
          <ng-template #paid>Paid</ng-template>
          <ng-template #unpaid>
            <span class="unpaid">
              <button class="mark-person-paid toggle alert" (click)="togglePersonPaid(person)">
                Unpaid
              </button>
            </span>
          </ng-template>
          <a routerLink="/person/{{ person.id }}">
            <span>{{ person.name }}</span>
          </a>
        </div>
      </div>
      <div class="notes">
        <h4>Bill Notes:</h4>
        <p>{{ bill?.notes }}</p>
      </div>
      <div class="delete">
        <span>
          <button class="alert" (click)="deleteBill()">Delete</button>
        </span>
      </div>
    </div>
  `,
  styles: []
})

export class BillDetailComponent implements OnInit {
  bill: Bill;

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

  togglePersonPaid(person: Person): void {
    if (!this.bill.paid_partial.includes(person)) {
      this.bill.paid_partial.push(person);
      this.bill.paid_partial_ids.push(person.id);
    } else {
      let i = this.bill.paid_partial.findIndex(v => v.id === person.id);
      this.bill.paid_partial.splice(i, 1);
      i = this.bill.paid_partial_ids.indexOf(person.id);
      this.bill.paid_partial_ids.splice(i, 1);
    }
    this.billService.updateBill(this.bill);
  }

  deleteBill(): void {
    let choice = confirm("Are You Sure You Want to Delete This Bill?");
    if (choice) {
      this.billService.deleteBill(this.bill.id);
      this.router.navigate(['/bills']);
    }
  }
}
