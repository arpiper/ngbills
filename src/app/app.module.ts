import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { HomeComponent } from './components/home.component';

import { BillModule } from './modules/bill.module';
import { AppRoutingModule } from './routes/app-routing.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
