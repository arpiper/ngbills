import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BillComponent } from '../components/bill.component';
import { BillDetailComponent } from '../components/bill-detail.component';
import { BillFormComponent } from '../components/bill-form.component';
import { PersonComponent,
         PersonDetailComponent } from '../components/person.component';
import { UtilityComponent,
         UtilityDetailComponent } from '../components/utility.component';
import { PersonResolver } from '../services/person.service';
import { UtilityResolver } from '../services/utility.service';

const billRoutes: Routes = [
  {
    path: 'bills',
    component: BillComponent,
  },
  {
    path: 'bills/:id',
    component: BillDetailComponent,
  },
  {
    path: 'people',
    redirectTo: '/persons',
    pathMatch: 'full',
  },
  {
    path: 'persons',
    component: PersonComponent,
  },
  {
    path: 'person/:id',
    redirectTo: 'persons/:id',
    pathMatch: 'full',
  },
  {
    path: 'persons/:id',
    component: PersonDetailComponent,
  },
  { 
    path: 'utilities',
    component: UtilityComponent,
  },
  {
    path: 'utilities/:id',
    component: UtilityDetailComponent,
  },
  {
    path: 'billform',
    component: BillFormComponent,
    resolve: {
      utilities: UtilityResolver,
      persons: PersonResolver,
    },
  },
];

@NgModule({
  imports: [ RouterModule.forChild(billRoutes) ],
  exports: [ RouterModule ],
  providers: [ UtilityResolver, PersonResolver ]
})
export class BillRoutingModule {}
