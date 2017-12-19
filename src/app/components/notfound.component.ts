import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'not-found',
  template: `
    <div>
      <h3>404 - Page Not Found</h3>
      <p>
      Oops. Looks like that page doesn't exist.
      </p>
    </div>
  `,
  styles: [],
})

export class NotFoundComponent {

  constructor() {}
}
