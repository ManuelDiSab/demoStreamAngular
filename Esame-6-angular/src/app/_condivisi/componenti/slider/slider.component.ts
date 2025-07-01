import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { filter, interval, Observable, Subject, takeUntil, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { UtilityService } from 'src/app/_servizi/utility.service';


@Component({
    selector: 'slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})

export class SliderComponent implements OnInit, OnDestroy{
    @Input('elementi') film!: (IFilm | ISerie)[]
    @Input('titolo') titolo!: string
    @Input('icona') icona: string | null = null
    @Input('genere') genere: string | null = null
    @Input('idGenere') idGenere: number | null = null    
    stato$: Subject<string> = new Subject()
    cancellato$: Observable<string>
    tMax: number = 1000
    obs_film$: Observable<I_rispostaserver>
    slides: IFilm[] = []
    formato: string = '.jpg' //formato delle immagini
    itemsPerSlide = 4
    responsiveOptions: any[] | undefined;
    circular = true
    constructor(private api: ApiService, public utility: UtilityService) {
        this.obs_film$ = this.api.getFilmTotali()
        this.cancellato$ = this.stato$.pipe(
            filter(x => x === 'Uscito'),
            tap(x => {
                console.log('%c Fine pressione', 'color:red; font-weight:bold;')
                // this.percPress.emit(0)
            })
        )
    }
    ngOnDestroy(): void {
        this.stato$.next('Uscito')
    }
    ngOnInit(): void {
        this.responsiveOptions = [
            {
                breakpoint: '2000px',
                numVisible: 5,
                numScroll: 5
            },
            {
                breakpoint: '1440px',
                numVisible: 4,
                numScroll: 4
            },
            {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 3
            },
            {
                breakpoint: '767px',
                numVisible: 2,
                numScroll: 2
            }
        ];
    }


    alMouseLeave(el: HTMLDivElement, img:HTMLImageElement) {
        console.log('esco dal bottone')
        this.stato$.next('Uscito')
        el.style.display = 'none'
        img!.style.display = 'block'
        img!.style.opacity = '1'
    }

    alMOuseEnter(el: HTMLDivElement, img:HTMLImageElement) {
        console.log('%c Sono entrato con il cursore', 'color:magenta; font-weight:bold;')
        this.stato$.next('Entro con il mouse')
        const n = 100
        interval(n).pipe(
            takeUntil(this.cancellato$),
            tap(x => {
                const v = x * n
                if (x >= 20) {
                    el.style.display = 'block'
                    img!.style.position = 'absolute'
                    img!.style.opacity = '0'
                }
            })
        ).subscribe(rit => console.log(rit, 'rit'))
    }


    /**
    * Funzione per far partire il video 'copertina'
    * @param el HTMLVideoElement
    */
    onOver(el: HTMLVideoElement): void {
        el.load()
        el.play()
    }
    /**
     * Funzione per mettere in pausa il video passato
     * 
     * @param el HTMLVideoElement
     */
    onLeave(el: HTMLVideoElement): void {
        el.pause()
    }
    
    /**
     * Funzione per aggiungere od elimnare il film dai preferiti
     * @param item IFilm o ISerie (interface per i film / Interface per le serie tv )
     * @returns void
     */
    preferiti(item: (IFilm | ISerie)) {
        if(item !== null){
        switch(item?.preferito){
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
    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'success'
        }
    }
}
