import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrazioneRoutingModule } from './registrazione-routing.module';
import { RegistrazioneComponent } from './registrazione.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    RegistrazioneComponent
  ],
  imports: [
    CommonModule,
    RegistrazioneRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    NgSelectModule
  ],
  providers: [
    NgbActiveModal,
]
})
export class RegistrazioneModule { }
