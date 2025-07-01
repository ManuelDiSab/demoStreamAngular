import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DettaglioFilmRoutingModule } from './dettaglio-film-routing.module';
import { DettaglioFilmComponent } from './dettaglio-film.component';
import { UiKitModule } from "../../_condivisi/uikit.module";
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    DettaglioFilmComponent
  ],
  imports: [
    CommonModule,
    DettaglioFilmRoutingModule,
    UiKitModule,
    NgbModalModule
]
})
export class DettaglioFilmModule { }
