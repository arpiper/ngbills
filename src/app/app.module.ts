import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { HomeComponent } from './components/home.component';
import { NotFoundComponent } from './components/notfound.component';

import { BillModule } from './modules/bill.module';
import { AppRoutingModule } from './routes/app-routing.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    BillModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
