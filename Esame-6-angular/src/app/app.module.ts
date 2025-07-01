import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';



import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  NgbDropdownModule, NgbModalModule, NgbModule,NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuAltoComponent } from './_componenti/menu-alto/menu-alto.component';
import { FooterComponent } from './_componenti/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { httpInterceptorProvider } from './_servizi/jwt-interceptor.service';
import { MenuLateraleComponent } from './_componenti/menu-laterale/menu-laterale.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    MenuAltoComponent,
    FooterComponent,
    MenuLateraleComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbNavModule,
    NgSelectModule,
    NgbModalModule,
    BrowserAnimationsModule
    ],
  providers: [httpInterceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule { }
