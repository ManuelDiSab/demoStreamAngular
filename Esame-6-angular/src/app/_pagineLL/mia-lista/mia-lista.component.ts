import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Router } from '@angular/router';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
@Component({
    selector: 'app-mia-lista',
    templateUrl: './mia-lista.component.html',
    styleUrls: ['./mia-lista.component.scss'],
})

export class MiaListaComponent implements OnInit {
    auth: BehaviorSubject<Auth>
    $film: Observable<I_rispostaserver>
    $serie: Observable<I_rispostaserver>
    film: IFilm[] = []
    serie: ISerie[] = []
    totali: (IFilm | ISerie)[] = []
    constructor(private api: ApiService, private oss: OsservatoriService, private authService: AuthService, private router: Router) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        this.$film = this.api.getFilmPreferiti()
        this.$serie = this.api.getSeriePreferite()
    }
    ngOnInit(): void {

        if (this.auth.value.token == null || this.auth.value.token == '') {
            this.router.navigateByUrl('/login')
        }

        this.$film.subscribe(this.oss.osservatoreFilm(this.totali))
        this.$serie.subscribe(this.oss.osservatore_serie(this.totali))
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
                    this.totali = []
                    this.$film.subscribe(this.oss.osservatoreFilm(this.totali))
                    this.$serie.subscribe(this.oss.osservatore_serie(this.totali))
                    break;
                
                case 'film':
                    this.totali = []
                    this.$film.subscribe(this.oss.osservatoreFilm(this.totali))
                    break
                
                case 'serie':
                    this.totali = []
                    this.$serie.subscribe(this.oss.osservatore_serie(this.totali))
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
