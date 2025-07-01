import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';

@Component({
    selector: 'app-ricerca',
    templateUrl: './ricerca.component.html',
    styleUrls: ['./ricerca.component.scss']
})
export class RicercaComponent implements OnInit {
    ricerca: string | null = null
    arr_serie:ISerie[] = []
    arr_film:IFilm[] = []
    arr_ricerca: (ISerie | IFilm)[] = []
    serie$: Observable<I_rispostaserver>
    film$: Observable<I_rispostaserver>
    constructor(private api: ApiService, private oss: OsservatoriService, private route: ActivatedRoute) {
        this.serie$ = this.api.getSeriePerNome(this.ricerca!)
        this.film$ = this.api.getFilmPerNome(this.ricerca!)
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {//Mi sottoscrivo all'activated route cosicchè quando egli cambia, cambi anche la risorsa che voglio visualizzare
            this.ricerca = params.get('ricerca');
            this.arr_ricerca = []
             this.serie$ = this.api.getSeriePerNome(this.ricerca!)
        this.film$ = this.api.getFilmPerNome(this.ricerca!)
            this.serie$.subscribe(this.oss.osservatore_serie(this.arr_ricerca))
            this.film$.subscribe(this.oss.osservatoreFilm(this.arr_ricerca))
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
                    this.arr_ricerca = []
                    this.film$.subscribe(this.oss.osservatoreFilm(this.arr_ricerca))
                    this.serie$.subscribe(this.oss.osservatore_serie(this.arr_ricerca))
                    break;
                
                case 'film':
                    this.arr_ricerca = []
                    this.film$.subscribe(this.oss.osservatoreFilm(this.arr_ricerca))
                    break
                
                case 'serie':
                    this.arr_ricerca = []
                    this.serie$.subscribe(this.oss.osservatore_serie(this.arr_ricerca))
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
