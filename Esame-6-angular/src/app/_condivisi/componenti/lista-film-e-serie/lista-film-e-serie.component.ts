import { Component, Input, OnInit } from '@angular/core';
import { filter, interval, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';

@Component({
    selector: 'container-list',
    templateUrl: './lista-film-e-serie.component.html',
    styleUrls: ['./lista-film-e-serie.component.scss']
})
export class ListaFilmESerieComponent implements OnInit {
    @Input('film') film!: IFilm[]
    @Input('serie') serie!: ISerie[]
    @Input('elementi') elementi!: (IFilm | ISerie)[]
    stato$: Subject<string> = new Subject()
    cancellato$: Observable<string>
    tMax: number = 700
    constructor() {
        this.cancellato$ = this.stato$.pipe(
            filter(x => x === 'Uscito'),
            tap(x => {
                console.log('%c Fine pressione', 'color:red; font-weight:bold;')
                // this.percPress.emit(0)
            })
        )
    }
    ngOnInit(): void {

    }
    alMouseLeave(el: HTMLDivElement,  movie: ISerie | IFilm) {
        let width = window.innerWidth
        let img = document.getElementById(movie.titolo)

        if (width >= 1025) {
            console.log(width)
            console.log('esco dal bottone')
            this.stato$.next('Uscito')
            el.style.display = 'none'
            img!.style.display = 'block'
            img!.style.opacity = '1'
        }

    }

    alMOuseEnter(el: HTMLDivElement, movie: ISerie | IFilm) {
        let width = window.innerWidth
        let img = document.getElementById(movie.titolo)
        if (width >= 1025) {
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

    }
}
