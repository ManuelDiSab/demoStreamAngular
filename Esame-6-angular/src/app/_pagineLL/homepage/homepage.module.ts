import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage.component';
import { AppComponent } from 'src/app/app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiKitModule } from "../../_condivisi/uikit.module";


@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    NgbModule,
    UiKitModule
]
})
export class HomepageModule { }
