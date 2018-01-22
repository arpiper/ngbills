import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Bill } from '../models/bill';
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
        <button (click)="addUtility(utilityName.value); utilityName.value=''" >Add Utility</button>
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
  utility: Utility;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.getUtility();
  }

  getUtility(): void {
    let id = +this.route.snapshot.paramMap.get('id');
    this.utilityService.getUtility(id).then(
      res => {
        if (res.status_code === 404) {
          this.router.navigate(['/404']);
        }
        this.utility = res;
      });
  }
}
