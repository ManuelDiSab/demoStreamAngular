import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
@Component({
    selector: 'app-film',
    templateUrl: './film.component.html',
    styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {
    auth: BehaviorSubject<Auth>
    obs_film$: Observable<I_rispostaserver>
    azione$: Observable<I_rispostaserver>
    drama$: Observable<I_rispostaserver>
    thriller$: Observable<I_rispostaserver>
    film: IFilm[] = []
    film_azione: IFilm[] = []
    film_drammatici: IFilm[] = []
    film_thriller: IFilm[] = []
    constructor(private authService: AuthService, private router: Router, private api: ApiService, private config: NgbCarouselConfig, private oss: OsservatoriService) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        this.config.showNavigationArrows = false
        this.obs_film$ = this.api.getFilmTotali()
        this.azione$ = this.api.getFilmPerGenere('2')
        this.drama$ = this.api.getFilmPerGenere('7')
        this.thriller$ = this.api.getFilmPerGenere('10')
    }
    ngOnInit(): void {
        this.obs_film$.subscribe(this.oss.osservatoreFilm(this.film))
        this.azione$.subscribe(this.oss.osservatoreFilm(this.film_azione))
        this.drama$.subscribe(this.oss.osservatoreFilm(this.film_drammatici))
        this.thriller$.subscribe(this.oss.osservatoreFilm(this.film_thriller))
        if (this.auth.value.token == null || this.auth.value.token == '') {
            this.router.navigateByUrl('/login')
        }
    }

    preferiti() {

    }

}
