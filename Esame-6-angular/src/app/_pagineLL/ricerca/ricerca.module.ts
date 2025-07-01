import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RicercaRoutingModule } from './ricerca-routing.module';
import { RicercaComponent } from './ricerca.component';
import { UiKitModule } from "../../_condivisi/uikit.module";


@NgModule({
  declarations: [
    RicercaComponent
  ],
  imports: [
    CommonModule,
    RicercaRoutingModule,
    UiKitModule
]
})
export class RicercaModule { }
