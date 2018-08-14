import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './components/home.component';
import { NotFoundComponent } from './components/notfound.component';
import { DatePicker } from './components/date-picker.component';
import { ChartComponent } from './components/chart.component';
import { BillFormComponent } from './components/bill-form.component';
import { LoginComponent } from './components/login.component';

import { DomService } from './services/dom.service';
import { ModalService } from './services/modal.service';
import { AuthService } from './services/auth.service';

import { BillModule } from './modules/bill.module';
import { AppRoutingModule } from './routes/app-routing.module';

import { AppComponent } from './app.component';

import { HttpXsrfInterceptor, HttpCsrfTokenExtractor } from './interceptors/httpxsrf.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    LoginComponent,
  ],
  imports: [
    BillModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'CSRF-Token',
      headerName: 'X-CSRF-Token',
    }),
  ],
  entryComponents: [
    BillFormComponent,
  ],
  providers: [
    DomService,
    ModalService,
    AuthService,
    HttpCsrfTokenExtractor,
    {provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
