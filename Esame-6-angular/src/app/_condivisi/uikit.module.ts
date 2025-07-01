import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SliderComponent } from './componenti/slider/slider.component';
import { SliderGrandeComponent } from './componenti/slider-grande/slider-grande.component';
import { NavTabComponent } from './componenti/nav-tab/nav-tab.component';
import { CarouselModule} from 'primeng/carousel';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ListaFilmESerieComponent } from './componenti/lista-film-e-serie/lista-film-e-serie.component';
// import { CardComponent } from './componenti/card/card.component';


const COMPONENTI = [SliderComponent,SliderGrandeComponent,NavTabComponent,ListaFilmESerieComponent]

@NgModule({
  declarations: [
    ...COMPONENTI
  ],
  exports:[
    ...COMPONENTI
  ],

  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    NgbCarouselModule
  ]
})
export class UiKitModule { }