import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './components/home.component';
import { NotFoundComponent } from './components/notfound.component';
import { DatePicker } from './components/date-picker.component';
import { ChartComponent } from './components/chart.component';
import { BillFormComponent } from './components/bill-form.component';

import { DomService } from './services/dom.service';
import { ModalService } from './services/modal.service';

import { BillModule } from './modules/bill.module';
import { AppRoutingModule } from './routes/app-routing.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    BillModule,
  ],
  entryComponents: [
    BillFormComponent,
  ],
  providers: [
    DomService,
    ModalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
