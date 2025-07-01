import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestioneEpisodiRoutingModule } from './gestione-episodi-routing.module';
import { GestioneEpisodiComponent } from './gestione-episodi.component';


@NgModule({
  declarations: [
    GestioneEpisodiComponent
  ],
  imports: [
    CommonModule,
    GestioneEpisodiRoutingModule
  ]
})
export class GestioneEpisodiModule { }
