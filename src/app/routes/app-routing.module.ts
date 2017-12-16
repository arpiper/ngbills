import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillComponent } from '../components/bill.component';
import { HomeComponent } from '../components/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    redirectTo: '/',
    pathMatch: 'full',
  },
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
