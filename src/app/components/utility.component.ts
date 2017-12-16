import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { UtilityService } from '../services/utility.service';

@Component({
  moduleId: module.id,
  selector: 'utility-cmp',
  template: `
    <h3>Utility</h3>
    <div class="add-utility">
      <span *ngIf="no_name" class="alert">
        No name entered
      </span>
      <input #utilityName type="text" placeholder="Utility">
      <button (click)="addUtility(utilityName.value); utilityName.value=''" >Add Utility</button>
    </div>
    <div class="utilities">
      <div *ngFor="let utility of utilities">
        {{ utility.name }}
      </div>
    </div>

  `,
  styles: [`
    .alert {
      color: red;
    }
    .alert + input:focus {
      outline-color: red;
    }
  `],
})

export class UtilityComponent implements OnInit {
  private utilities: Utility[];
  private addUtilityObj: Utility;
  private no_name: boolean = false;
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
      this.utilities = res;
    });
  }
}

@Component({
  moduleId: module.id,
  selector: 'utility-detail-cmp',
  template: `
    <div class="utility-details">
      <h3>{{ utility?.name }}</h3>
    </div>
  `,
  styles: [],
})

export class UtilityDetailComponent implements OnInit {
  private utility: Utility;

  constructor(
    private route: ActivatedRoute,
    private utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.getUtility();
  }

  getUtility(): void {
    let id = +this.route.snapshot.paramMap.get('id');
    this.utilityService.getUtility(id).then(
      res => {
        this.utility = res;
      });
  }
}
