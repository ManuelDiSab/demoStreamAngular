import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmRoutingModule } from './film-routing.module';
import { FilmComponent } from './film.component';
import { httpInterceptorProvider } from 'src/app/_servizi/jwt-interceptor.service';
import { HttpClientModule } from '@angular/common/http';
import { UiKitModule } from 'src/app/_condivisi/uikit.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    FilmComponent,
  ],
  imports: [
    CommonModule,
    FilmRoutingModule,
    UiKitModule,
    NgbCarouselModule
]
})
export class FilmModule { }
