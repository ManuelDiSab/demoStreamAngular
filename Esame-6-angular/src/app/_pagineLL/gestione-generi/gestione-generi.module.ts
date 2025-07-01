import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestioneGeneriRoutingModule } from './gestione-generi-routing.module';
import { GestioneGeneriComponent } from './gestione-generi.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    GestioneGeneriComponent
  ],
  imports: [
    CommonModule,
    GestioneGeneriRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule
  ]
})
export class GestioneGeneriModule { }
