import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Pagina404RoutingModule } from './pagina404-routing.module';
import { Pagina404Component } from './pagina404.component';


@NgModule({
  declarations: [
    Pagina404Component
  ],
  imports: [
    CommonModule,
    Pagina404RoutingModule
  ]
})
export class Pagina404Module { }
