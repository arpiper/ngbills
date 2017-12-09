import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BillComponent } from '../components/bill.component';
import { BillFormComponent } from '../components/bill-form.component';
import { BillService } from '../services/bill.service';
import { UtilityService } from '../services/utility.service';
import { PersonService } from '../services/person.service';
import { BillRoutingModule } from '../routes/bill-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BillRoutingModule,
  ],
  declarations: [
    BillComponent,
    BillFormComponent,
  ],
  providers: [
    BillService,
    UtilityService,
    PersonService,
  ]
})

export class BillModule {}
