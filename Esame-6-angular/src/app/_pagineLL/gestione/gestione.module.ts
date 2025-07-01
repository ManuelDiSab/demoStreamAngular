import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestioneRoutingModule } from './gestione-routing.module';
import { GestioneComponent } from './gestione.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UiKitModule } from 'src/app/_condivisi/uikit.module';



@NgModule({
  declarations: [
    GestioneComponent
  ],
  imports: [
    CommonModule,
    GestioneRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbDropdownModule,
    UiKitModule
  ]
})
export class GestioneModule { }
