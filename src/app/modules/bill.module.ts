import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BillComponent } from '../components/bill.component';
import { BillDetailComponent, 
         BillDetailInlineComponent } from '../components/bill-detail.component';
import { BillFormComponent } from '../components/bill-form.component';
import { UtilityComponent,
         UtilityDetailComponent } from '../components/utility.component';
import { PersonComponent,
         PersonDetailComponent } from '../components/person.component';
import { BillService } from '../services/bill.service';
import { UtilityService } from '../services/utility.service';
import { PersonService } from '../services/person.service';
import { BillRoutingModule } from '../routes/bill-routing.module';

import { DatePicker } from '../components/date-picker.component';
import { ChartComponent } from '../components/chart.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BillRoutingModule,
  ],
  declarations: [
    BillComponent,
    BillDetailComponent,
    BillDetailInlineComponent,
    BillFormComponent,
    UtilityComponent,
    UtilityDetailComponent,
    PersonComponent,
    PersonDetailComponent,
    DatePicker,
    ChartComponent,
  ],
  providers: [
    BillService,
    UtilityService,
    PersonService,
  ],
  exports: [
    BillDetailInlineComponent,
  ]
})

export class BillModule {}
