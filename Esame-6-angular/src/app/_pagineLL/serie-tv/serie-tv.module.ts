import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SerieTvRoutingModule } from './serie-tv-routing.module';
import { SerieTvComponent } from './serie-tv.component';
import { UiKitModule } from "../../_condivisi/uikit.module";


@NgModule({
  declarations: [
    SerieTvComponent
  ],
  imports: [
    CommonModule,
    SerieTvRoutingModule,
    UiKitModule
]
})
export class SerieTvModule { }
