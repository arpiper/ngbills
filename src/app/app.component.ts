import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  template: `
    <main class="container">
      <div class="header">
        <h2>Roommate Bill Tracker</h2>
      </div>
      <nav class="navigation">
        <ul class="main">
          <a *ngFor="let component of components" routerLink="/{{component}}" routerLinkActive="active">
            <li>{{ component | uppercase }}</li>
          </a>
        </ul>
      </nav>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
  title = 'app';
  components = [
    "home",
    "bills",
    "utilities",
    "People",
  ];

  constructor(
  ) {}
}
