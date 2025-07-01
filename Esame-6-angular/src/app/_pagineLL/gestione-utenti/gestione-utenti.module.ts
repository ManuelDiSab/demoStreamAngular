import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestioneUtentiRoutingModule } from './gestione-utenti-routing.module';
import { GestioneUtentiComponent } from './gestione-utenti.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GestioneUtentiComponent
  ],
  imports: [
    CommonModule,
    GestioneUtentiRoutingModule,
    NgbDropdownModule,
    ReactiveFormsModule
  ]
})
export class GestioneUtentiModule { }
