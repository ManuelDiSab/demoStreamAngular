import { Component, ElementRef, inject, OnDestroy, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, ParamMap, Params, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';

@Component({
    selector: 'app-dettaglio-film',
    templateUrl: './dettaglio-film.component.html',
    styleUrls: ['./dettaglio-film.component.scss']
})
export class DettaglioFilmComponent implements OnInit {
    auth: BehaviorSubject<Auth>
    film$!: Observable<I_rispostaserver>
    gruppo_film$!: Observable<I_rispostaserver>
    arr_film: IFilm[] = []
    risorsa: IFilm | null = null
    id: string | null = ''
    idGenere: string | null = null
    generi_secondari: string = ''
    closeResult = ''
    private modalService = inject(NgbModal);

    constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute, private api: ApiService,
         private oss: OsservatoriService, private utility:UtilityService) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        this.route.paramMap.subscribe((params) => {//Mi sottoscrivo all'activated route cosicchè quando egli cambia, cambi anche la risorsa che voglio visualizzare
            this.id = params.get('id');
            this.film$ = this.api.getFilmPerNome(this.id!)
            this.gruppo_film$ = this.api.getFilmTotali()
            this.gruppo_film$.subscribe(this.oss.osservatoreFilm(this.arr_film))
            this.film$.subscribe(this.osservatoreFilm())
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {//Mi sottoscrivo all'activated route cosicchè quando egli cambia, cambi anche la risorsa che voglio visualizzare
            this.id = params.get('id');
            this.film$ = this.api.getFilmPerNome(this.id!)
            this.gruppo_film$ = this.api.getFilmTotali()
            this.gruppo_film$.subscribe(this.oss.osservatoreFilm(this.arr_film))
            this.film$.subscribe(this.osservatoreFilm())
        });
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        if (this.auth.value.token == null || this.auth.value.token == '') {
            this.router.navigateByUrl('/login')
        }
    }

    /**
     * Funzione per aggiungere od elimnare il film dai preferiti
     * @param item IFilm o ISerie (interface per i film / Interface per le serie tv )
     * @returns void
     */
    preferiti(item: (IFilm | null)) {
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

    private osservatoreFilm() {
        return {
            next: (rit: I_rispostaserver) => {

                const elem = rit.data
                for (let i = 0; i < elem.length; i++) {

                    const movie: IFilm = {
                        idFilm: elem[i].idFilm,
                        titolo: elem[i].titolo,
                        genere: elem[i].genere,
                        idGenere: elem[i].idGenere,
                        generi_secondari: elem[i].generi_secondari,
                        trama: elem[i].trama,
                        anno: elem[i].anno,
                        durata: elem[i].durata,
                        regista: elem[i].regista,
                        path: elem[i].path,
                        video:elem[i].path_video,
                        voto: elem[i].voto,
                        film: true,
                        preferito: elem[i].preferito

                    }
                    if (movie.generi_secondari) {
                        this.generi_secondari = movie.generi_secondari
                    }
                    this.risorsa = movie
                }
            },
            error: (err: any) => {
                console.log('error:', err)
            },
            complete: () => {
                console.log('completato')
            }
        }
    }


    setVideo() {
        let video = document.getElementById('film') as HTMLVideoElement
        video.style.width = '100%'
        video.style.height = 'auto'
        video.requestFullscreen()
    }



    open(content: TemplateRef<any>) {
        this.modalService.open(content, { fullscreen: true }).result.then(
            (result: any) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason: any) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            },
        );
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}
