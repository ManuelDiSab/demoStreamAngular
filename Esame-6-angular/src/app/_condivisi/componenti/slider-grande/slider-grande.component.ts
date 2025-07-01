import { Component, HostListener, Input } from '@angular/core';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { iif } from 'rxjs';

@Component({
  selector: 'slider-grande',
  templateUrl: './slider-grande.component.html',
  styleUrls: ['./slider-grande.component.scss']
})
export class SliderGrandeComponent {

  @Input('elementi') film!: (IFilm | ISerie)[]
  @Input('titolo') titolo!: string
  @Input('icona') icona: string | null = null

  constructor(private config: NgbCarouselConfig, private utility: UtilityService) {
    this.config.showNavigationArrows = false
    this.config.wrap = true
  }
  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  public resize() {
    if(window.innerWidth <= 768){
      console.log('bau bau')
      this.config.showNavigationArrows = true 
    }
  }
  /**
   * Funzione per aggiungere od elimnare il film dai preferiti
   * @param item IFilm o ISerie (interface per i film / Interface per le serie tv )
   * @returns void
   */
  preferiti(item: (IFilm | ISerie)) {
    if (item !== null) {
      switch (item?.preferito) {
        case true:
          this.utility.TogliDaiPreferiti(item)
          item.preferito = false
          console.log('preferito')
          break;
        case false:
          this.utility.AddPreferiti(item)
          item.preferito = true
          console.log(' non preferito')
      }
    }
  }


}
