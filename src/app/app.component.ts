import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from './services/auth.service';
import { PersonService } from './services/person.service';
import { UtilityService } from './services/utility.service';
import { ModalService } from './services/modal.service';
import { BillFormComponent } from './components/bill-form.component';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  template: `
    <main class="container">
      <div class="header">
        <h2 class="header__title">Roommate Bill Tracker</h2>
        <!--login-cmp></login-cmp-->
        <bill-btn *ngIf="isAuth" button_text="Logout" (click)="logoutUser()" ></bill-btn>
      </div>
      <nav class="nav">
        <ul class="menu">
          <li class="menu__item" *ngFor="let component of components">
            <a 
              class="menu__item padten menu__link" 
              routerLink="/{{component}}" 
              routerLinkActive="active">
              {{ component | uppercase }}
            </a>
          </li>
        </ul>
        <bill-btn class="selfcenter" (click)="showForm()" [button_text]="'Add New Bill'"></bill-btn>
      </nav>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
      <div class="footer">
        <p>&copy; Andrew Piper</p>
      </div>
    </main>
    <div class="hidden modal__container" id="modal-container"></div>
    <div class="hidden modal__overlay" id="modal-overlay" (click)="closeForm()"></div>
  `,
})
export class AppComponent implements OnInit {
  isAuth: boolean = false;
  show_form: boolean = false;
  title: string = 'app';
  components = [
    "home",
    "bills",
    "utilities",
    "people",
  ];

  constructor(
    private authService: AuthService,
    private modalService: ModalService,
    private personService: PersonService,
    private utilityService: UtilityService
  ) {
    authService.loginSuccessful.subscribe(
      response => {
        console.log(response);
      }
    );
  }

  ngOnInit(): void { 
    this.authService.isAuthenticated()
      .then(response => {
        this.isAuth = response;
      });
  }

  async showForm() {
    let persons = await this.personService.getPersons();
    let utilities = await this.utilityService.getUtilities();
    let inputs = {
      persons: persons.data.persons,
      utilities: utilities.data.utilities,
    };
    let outputs = {
      billAdded: (a) => console.log(a),
    };
    this.modalService.init(BillFormComponent, inputs, outputs)
      .instance.addedBill.subscribe(v => this.closeForm());
  }

  closeForm(): void {
    this.modalService.destroy();
  }

  logoutUser(): void {
    this.authService.logout();
  }
}
