import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BillComponent } from './components/bill.component';
import { AppRoutingModule } from './routes/app-routing.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    BillComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
