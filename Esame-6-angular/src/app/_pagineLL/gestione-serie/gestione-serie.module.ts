import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestioneSerieRoutingModule } from './gestione-serie-routing.module';
import { GestioneSerieComponent } from './gestione-serie.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapse, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    GestioneSerieComponent
  ],
  imports: [
    CommonModule,
    GestioneSerieRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapse,
    NgbDropdownModule
  ]
})
export class GestioneSerieModule { }
