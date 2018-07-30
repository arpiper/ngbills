import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { animate, keyframes, trigger, transition, style, state } from '@angular/animations';

import { Bill } from '../models/bill';
import { BillService } from '../services/bill.service';
import { Utility } from '../models/utility';
import { UtilityService } from '../services/utility.service';

@Component({
  moduleId: module.id,
  selector: 'utility-cmp',
  template: `
    <div class="utilities-header">
      <h3>Utility</h3>
      <div class="add-utility">
        <span *ngIf="no_name" class="alert">
          No name entered
        </span>
        <input #utilityName type="text" placeholder="Utility"
          (keyup.enter)="addUtility(utilityName.value); utilityName.value=''">
        <button class="button" (click)="addUtility(utilityName.value); utilityName.value=''" >
          Add Utility
        </button>
      </div>
    </div>
    <div class="utilities">
      <div *ngFor="let utility of utilities">
        <a routerLink="/utilities/{{ utility.id }}">{{ utility.name }}</a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      width: 100%;
      flex: 1 1 100%;
    }
    .utilities-header,
    .add-utility {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .utilities-header h3 {
      flex: 2;
    }
    .add-utility {
      flex: 3;
      justify-content: space-evenly;
    }
  `],
})

export class UtilityComponent implements OnInit {
  utilities: Utility[];
  addUtilityObj: Utility;
  no_name: boolean = false;
  @ViewChild('utilityName') private inputEl: ElementRef;

  constructor(
    private utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.getUtilities();
    this.addUtilityObj = new Utility({name: ''});
  }

  addUtility(name: string): void {
    if (name.length !== 0) {
      this.addUtilityObj.name = name;
      this.utilityService.saveUtility(this.addUtilityObj);
      this.getUtilities();
      this.no_name = false;
    } else {
      this.inputEl.nativeElement.focus();
      this.no_name = true;
    }
  }

  getUtilities(): void {
    this.utilityService.getUtilities().then( (res) => {
      this.utilities = res.data.utilities;
    });
  }
}

@Component({
  moduleId: module.id,
  selector: 'utility-detail-cmp',
  template: `
    <div class="utility-details">
      <h2>{{ utility?.name }}</h2>
      <span class="right">
        <span class="label">Total Payments</span>
        <span class="value">{{ utility?.payments | currency: 'USD' }}</span>
      </span>
    </div>
    <div class="payment-graph">
      <h4>Bill History</h4>
      <div>
        <chart-cmp [data]="paid_bills" chartid="utilitychart">
        </chart-cmp>
      </div>
    </div>
    <div class="active-bills">
      <h3>Currently Unpaid Bills</h3>
      <div *ngFor="let bill of unpaid_bills" class="bill-detail">
        <bill-detail-inline-cmp [bill]="bill">
        </bill-detail-inline-cmp>
      </div>
    </div>
    <div class="paid-bills" (click)="showPaidBills = !showPaidBills">
      <span class="label">
        <h3>Paid Bills</h3>
        <span [class]="showPaidBills ? 'chevron up': 'chevron'"></span>
      </span>
      <div *ngIf="showPaidBills" @animateBills>
        <div *ngFor="let bill of paid_bills" class="bill-detail">
          <bill-detail-inline-cmp [bill]="bill">
          </bill-detail-inline-cmp>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      width: 100%;
    }
  `],
  animations: [
    trigger('animateBills', [
      state('*', style({opacity: 1, transform: 'translateY(0)'})),
      transition('void => *', [
        style({opacity: 0, transform: 'translateY(-15%)'}),
        animate('0.5s ease-in')
      ]),
      state('void', style({opacity: 0, transform: 'translateY(-25%)'})),
      transition('* => void', [
        style({opacity: 1, transform: 'translateY(0)'}),
        animate('0.5s ease-out')
      ])
    ])
  ]
})

export class UtilityDetailComponent implements OnInit {
  id: string;
  utility: Utility;
  paid_bills: Bill[];
  unpaid_bills: Bill[];
  showPaidBills: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private billService: BillService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getUtility();
    this.getBills();
  }

  getUtility(): void {
    this.utilityService.getUtility(this.id).then(
      res => {
        if (res.status_code === 404) {
          this.router.navigate(['/404']);
        }
        this.utility = res.data.utility;
      });
  }

  getBills(): void {
    this.billService.getBills().then(
      response => {
        this.unpaid_bills = response.data.bills.filter(
          v => (v.paid_to.id === this.id && !v.paid_full)
        );
        this.paid_bills = response.data.bills.filter(
          v => (v.paid_to.id === this.id && v.paid_full)
        );
      }
    );
  }
}
