import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiaListaRoutingModule } from './mia-lista-routing.module';
import { MiaListaComponent } from './mia-lista.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiKitModule } from "../../_condivisi/uikit.module";



@NgModule({
  declarations: [
    MiaListaComponent
  ],
  imports: [
    CommonModule,
    MiaListaRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    UiKitModule
]
})
export class MiaListaModule {

  
 }
