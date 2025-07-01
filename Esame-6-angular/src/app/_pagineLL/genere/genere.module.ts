import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenereRoutingModule } from './genere-routing.module';
import { GenereComponent } from './genere.component';
import { UiKitModule } from "../../_condivisi/uikit.module";


@NgModule({
  declarations: [
    GenereComponent
  ],
  imports: [
    CommonModule,
    GenereRoutingModule,
    UiKitModule
]
})
export class GenereModule { }
