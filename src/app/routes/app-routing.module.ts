import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillComponent } from '../components/bill.component';

const routes: Routes = [
  {
    path: 'b',
    component: BillComponent,
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [],
})
export class AppRoutingModule {}
