import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
    auth: BehaviorSubject<Auth>
    obs_film$: Observable<I_rispostaserver>
    obs_serie$: Observable<I_rispostaserver>
    film_azione$: Observable<I_rispostaserver>
    film_drama$: Observable<I_rispostaserver>
    film_thriller$: Observable<I_rispostaserver>
    serie_azione$: Observable<I_rispostaserver>
    serie_drama$: Observable<I_rispostaserver>
    serie_thriller$: Observable<I_rispostaserver>
    film: IFilm[] = []
    serie: ISerie[] = []
    popolari: (IFilm | ISerie)[] = []
    azione: (IFilm | ISerie)[] = []
    drammatici: (IFilm | ISerie)[] = []
    thriller: (IFilm | ISerie)[] = []
    sciFi: (IFilm | ISerie)[] = []

    constructor(private authService: AuthService, private api: ApiService, private router: Router, private config: NgbCarouselConfig, private oss: OsservatoriService) {
        this.obs_film$ = this.api.getFilmTotali()
        this.film_azione$ = this.api.getFilmPerGenere('2')
        this.film_drama$ = this.api.getFilmPerGenere('7')
        this.film_thriller$ = this.api.getFilmPerGenere('10')
        this.serie_azione$ = this.api.getSeriePerGenere('2')
        this.serie_drama$ = this.api.getSeriePerGenere('7')
        this.serie_thriller$ = this.api.getSeriePerGenere('10')
        this.obs_serie$ = this.api.getSerieTvTotali()
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        this.config.showNavigationArrows = false
    }
    ngOnInit(): void {
        this.obs_film$.subscribe(this.oss.osservatoreFilm(this.popolari))
        this.film_azione$.subscribe(this.oss.osservatoreFilm(this.azione))
        this.film_drama$.subscribe(this.oss.osservatoreFilm(this.drammatici))
        this.film_thriller$.subscribe(this.oss.osservatoreFilm(this.thriller))
        this.serie_azione$.subscribe(this.oss.osservatore_serie(this.azione))
        this.serie_drama$.subscribe(this.oss.osservatore_serie(this.drammatici))
        this.serie_thriller$.subscribe(this.oss.osservatore_serie(this.thriller))
        this.obs_serie$.subscribe(this.oss.osservatore_serie(this.popolari))
        if (this.auth.value.token == null || this.auth.value.token == '') {
            this.router.navigateByUrl('/login')
        }
    }
 shuffle(array:(IFilm|ISerie)[]) {

  return array.sort(() => Math.random() - 0.5);
}
}
