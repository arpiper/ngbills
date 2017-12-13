import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BillComponent } from '../components/bill.component';
import { BillFormComponent } from '../components/bill-form.component';
import { UtilityComponent } from '../components/utility.component';
import { PersonComponent } from '../components/person.component';
import { BillService } from '../services/bill.service';
import { UtilityService } from '../services/utility.service';
import { PersonService } from '../services/person.service';
import { BillRoutingModule } from '../routes/bill-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BillRoutingModule,
  ],
  declarations: [
    BillComponent,
    BillFormComponent,
    UtilityComponent,
    PersonComponent,
  ],
  providers: [
    BillService,
    UtilityService,
    PersonService,
  ]
})

export class BillModule {}
