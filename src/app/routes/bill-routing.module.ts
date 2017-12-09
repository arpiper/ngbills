import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BillComponent } from '../components/bill.component';
import { UtilityResolver } from '../services/utility.service';
import { PersonResolver } from '../services/person.service';

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
  }*/
];

@NgModule({
  imports: [ RouterModule.forChild(billRoutes) ],
  exports: [ RouterModule ],
  providers: [ UtilityResolver, PersonResolver ]
})
export class BillRoutingModule {}
