import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestioneFilmRoutingModule } from './gestione-film-routing.module';
import { GestioneFilmComponent } from './gestione-film.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    GestioneFilmComponent
  ],
  imports: [
    CommonModule,
    GestioneFilmRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbModalModule,
  ],providers: [
    NgbActiveModal,
]
})
export class GestioneFilmModule { }
