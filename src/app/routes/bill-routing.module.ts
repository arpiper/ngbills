import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BillComponent } from '../components/bill.component';
import { PersonComponent } from '../components/person.component';
import { UtilityComponent } from '../components/utility.component';
import { PersonResolver } from '../services/person.service';
import { UtilityResolver } from '../services/utility.service';

const billRoutes: Routes = [
  {
    path: 'bills',
    component: BillComponent,
    resolve: {
      utilities: UtilityResolver,
      persons: PersonResolver,
    },
  },
  /*{
    path: 'bills/:id',
    resolve: {
      bill: BillDetailResolver,
    }
  },*/
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
    path: 'utilities',
    component: UtilityComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forChild(billRoutes) ],
  exports: [ RouterModule ],
  providers: [ UtilityResolver, PersonResolver ]
})
export class BillRoutingModule {}
