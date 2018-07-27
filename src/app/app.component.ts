import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'app-root',
  template: `
    <main class="container">
      <div class="header">
        <h2>Roommate Bill Tracker</h2>
        <bill-btn (click)="toggleBillForm()" [button_text]="'Add New Bill'"></bill-btn>
      </div>
      <nav class="navigation">
        <ul class="main">
          <a *ngFor="let component of components" routerLink="/{{component}}" routerLinkActive="active">
            <li>{{ component | uppercase }}</li>
          </a>
        </ul>
      </nav>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
      <div class="footer">
        <p>&copy; Andrew Piper</p>
      </div>
    </main>
    <bill-form *ngIf="show_form" (addedBill)="toggleBillForm()" (click)="closeForm($event)"></bill-form>
  `,
})
export class AppComponent {
  show_form = false;
  title = 'app';
  components = [
    "home",
    "bills",
    "utilities",
    "people",
  ];

  constructor(
  ) {}

  toggleBillForm(): void {
    this.show_form = !this.show_form;
  }

  closeForm(evt): void {
    if (evt.target.nodeName === 'BILL-FORM') {
      this.show_form = false;
    }
  }
}
