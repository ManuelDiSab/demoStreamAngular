import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DettaglioSerieRoutingModule } from './dettaglio-serie-routing.module';
import { DettaglioSerieComponent } from './dettaglio-serie.component';
import { UiKitModule } from 'src/app/_condivisi/uikit.module';


@NgModule({
  declarations: [
    DettaglioSerieComponent
  ],
  imports: [
    CommonModule,
    DettaglioSerieRoutingModule,
    UiKitModule
  ]
})
export class DettaglioSerieModule { }
