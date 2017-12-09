import { Component } from '@angular/core';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { BillService } from '../services/bill.service';

@Component({
  moduleId: module.id,
  selector: 'person-cmp',
  template: `
    <h3>Persons</h3>
  `,
  styles: [],
})

export class PersonComponent {
}
