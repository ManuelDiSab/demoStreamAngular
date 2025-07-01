import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MioProfiloRoutingModule } from './mio-profilo-routing.module';
import { MioProfiloComponent } from './mio-profilo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    MioProfiloComponent
  ],
  imports: [
    CommonModule,
    MioProfiloRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule
  ]
})
export class MioProfiloModule { }
