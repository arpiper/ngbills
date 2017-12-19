import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home.component';
import { NotFoundComponent } from '../components/notfound.component';

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
    path: '404',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [],
})
export class AppRoutingModule {}
