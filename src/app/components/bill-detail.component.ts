import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Bill } from '../models/bill';
import { Person } from '../models/person';
import { BillService } from '../services/bill.service';
import { PersonService } from '../services/person.service';
import { UtilityService } from '../services/utility.service';

@Component({
  moduleId: module.id,
  selector: 'bill-detail-inline-cmp',
  template: `
    <div class="bill-details">
      <a routerLink="/bills/{{ bill.id }}">
        <div class="left">
          <span class="paid-to">
            <a routerLink="/utilities/{{ bill.paid_to.id }}" >
              {{ bill.paid_to.name | titlecase }}
            </a>
          </span>
          <span class="due-date">
            Due: {{ bill.due_date }}
          </span>
        </div>
        <div class="amount right">
          <div>
            <span>Bill Total Amount: {{ bill.amount | currency:'USD' }}</span>
          </div>
          <div >
            <span>Bill Split Amount: {{ bill.split_amount | currency: 'USD' }}</span>
          </div>
        </div>
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
        <h3>
          <a routerLink="/utilities/{{ bill?.paid_to.id }}"> 
            {{ bill?.paid_to.name | titlecase }}
          </a>
        </h3>
      </div>
      <div class="amount">
        <span class="label">Total Amount Due: </span>
        <span class="value">{{ bill?.amount | currency:'USD' }}</span>
      </div>
      <div class="due-date">
        <span class="label">Bill Due: </span>
        <span class="value">{{ bill?.due_date }}</span>
      </div>
      <div class="split-by">
        <h4>Split By:</h4>
        <div *ngFor="let person of bill?.split_by">
          <div *ngIf="bill.paid_partial_ids.includes(person.id); then paid else unpaid">
          </div>
          <a routerLink="/person/{{ person.id }}">
            <span>{{ person.name }}</span>
          </a>
          <ng-template #paid>
            <span class="">
              <button class="unmark-person-paid" disabled>
                <span class="checkmark"></span>
              </button>
            </span>
            <span class="person-paid">Paid</span>
          </ng-template>
          <ng-template #unpaid>
            <span class="person-unpaid">
              <button class="mark-person-paid toggle alert" (click)="togglePersonPaid(person)">
                Mark As Paid
              </button>
            </span>
            <span>Unpaid</span>
          </ng-template>
        </div>
      </div>
      <div *ngIf="bill?.notes" class="notes">
        <h4>Bill Notes:</h4>
        <p>{{ bill?.notes }}</p>
      </div>
      <div class="delete right">
        <span class="">
          <button class="alert" (click)="deleteBill()">Delete</button>
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      width: 100%;
    }
    .paid-to {
      font-weight: bold;
    }
    .amount .label,
    .amount .value {
      font-size: 14pt;
      font-weight: bold;
    }
    .amount .value {
      color: var(--color-red);
    }
  `]
})

export class BillDetailComponent implements OnInit {
  bill: Bill;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billService: BillService,
    private personService: PersonService,
    private utilityService: UtilityService
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
    if (this.bill.paid_partial.length === this.bill.split_by.length) {
      this.bill.paid_full = true;
      this.utilityService.updatePayments(this.bill.amount, this.bill.paid_to.id);
    }
    this.billService.updateBill(this.bill);
    this.personService.updatePaymentsMade(this.bill.split_amount, person.id);
  }

  deleteBill(): void {
    let choice = confirm("Are You Sure You Want to Delete This Bill?");
    if (choice) {
      this.billService.deleteBill(this.bill.id);
      this.router.navigate(['/bills']);
    }
  }
}
