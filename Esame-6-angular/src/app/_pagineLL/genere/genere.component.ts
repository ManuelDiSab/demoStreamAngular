import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';

@Component({
    selector: 'app-genere',
    templateUrl: './genere.component.html',
    styleUrls: ['./genere.component.scss']
})
export class GenereComponent implements OnInit {
    id: string | null = null
    arr_serie: ISerie[] = []
    arr_film: IFilm[] = []
    arr_totali:(IFilm| ISerie)[] = []
    serie$: Observable<I_rispostaserver>
    film$: Observable<I_rispostaserver>
    genere:string = ''

    constructor(private api: ApiService, private oss: OsservatoriService, private route: ActivatedRoute) {
        this.serie$ = this.api.getSeriePerGenere(this.id!)
        this.film$ = this.api.getFilmPerGenere(this.id!)
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {//Mi sottoscrivo all'activated route cosicchè quando egli cambia, cambi anche la risorsa che voglio visualizzare
            this.id = params.get('genere');
            this.api.getGenereById(this.id!.toString()).subscribe(
                rit => this.genere = rit.data.nome
            )
            this.serie$ = this.api.getSeriePerGenere(this.id!)
            this.film$ = this.api.getFilmPerGenere(this.id!)
            this.serie$.subscribe(this.oss.osservatore_serie(this.arr_totali))
            this.film$.subscribe(this.oss.osservatoreFilm(this.arr_totali))
        });
    }

     /** 
     * Funzione per rendere il button attivo 
     * @param $event any
     * @returns void
     */
    onButtonGroupClick($event: any): void {
        let clickedElement = $event.target || $event.srcElement;
        if (clickedElement?.nodeName === "BUTTON") {
            let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".attivo");
            switch (clickedElement.id) {
                case 'tutti':
                    this.arr_totali = []
                    this.film$.subscribe(this.oss.osservatoreFilm(this.arr_totali))
                    this.serie$.subscribe(this.oss.osservatore_serie(this.arr_totali))
                    break;
                
                case 'film':
                    this.arr_totali = []
                    this.film$.subscribe(this.oss.osservatoreFilm(this.arr_totali))
                    break
                
                case 'serie':
                    this.arr_totali = []
                    this.serie$.subscribe(this.oss.osservatore_serie(this.arr_totali))
                    break
            }
            //Se un button ha già la classe "attivo"
            if (isCertainButtonAlreadyActive) {
                isCertainButtonAlreadyActive.classList.remove("attivo");
            }
            clickedElement.className += " attivo";
        }
    }
}
