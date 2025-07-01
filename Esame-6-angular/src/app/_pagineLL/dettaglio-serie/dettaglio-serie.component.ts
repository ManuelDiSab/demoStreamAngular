import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { IEpisodio } from 'src/app/interfaces/IEpisodi.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';

@Component({
    selector: 'app-dettaglio-serie',
    templateUrl: './dettaglio-serie.component.html',
    styleUrls: ['./dettaglio-serie.component.scss']
})
export class DettaglioSerieComponent implements OnInit {

    closeResult = ''
    private modalService = inject(NgbModal);
    auth: BehaviorSubject<Auth>
    serie$!: Observable<I_rispostaserver>
    gruppo_serie$!: Observable<I_rispostaserver>
    episodi$!: Observable<I_rispostaserver>
    episodi_arr: IEpisodio[] = []
    arr_serie: ISerie[] = []
    risorsa: ISerie | null = null
    id: string | null = '' // ID della serie 
    generi_secondari: string = ''
    n_stagioni: number[] = [] //Array delle stagioni della serie selezionata

    constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute, private api: ApiService, private utility: UtilityService, private oss: OsservatoriService) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        this.route.paramMap.subscribe((params) => {
            this.id = params.get('id');
            this.serie$ = this.api.getSeriePerId(this.id!)
            this.episodi$ = this.api.getEpisodiSerie(this.id!)
            this.gruppo_serie$ = this.api.getSerieTvTotali()
        })
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {//Mi sottoscrivo all'activated route cosicchè quando egli cambia, cambi anche la risorsa che voglio visualizzare
            this.id = params.get('id');
            this.serie$.subscribe(this.osservatoreSerie())
            this.episodi_arr = []
            this.episodi$.subscribe(this.ossEpisodi())
            this.gruppo_serie$.subscribe(this.oss.osservatore_serie(this.arr_serie))
        })
        if (this.auth.value.token == null || this.auth.value.token == '') {
            this.router.navigateByUrl('/login')
        }
    }

    setVideo(string: string) {
        let video = document.getElementById('primo_ep') as HTMLVideoElement
        console.log('video', video)
        video.src = string
        video.style.width = '100%'
        video.style.height = 'auto'
        video.requestFullscreen()
    }

    getArrSerie() {
        const i = this.arr_serie.indexOf(this.risorsa!)
        console.log('arr', i)
    }
    /**
     * Funzione per aggiungere od elimnare il film dai preferiti
     * @param item IFilm o ISerie (interface per i film / Interface per le serie tv )
     * @returns void
     */
    preferiti(item: (ISerie | null)) {
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
    //Osservatore serie
    private osservatoreSerie() {
        return {
            next: (rit: I_rispostaserver) => {
                const elem = rit.data
                const serie: ISerie = {
                    idSerie: rit.data.idSerie,
                    titolo: rit.data.titolo,
                    genere: rit.data.genere,
                    idGenere: rit.data.idGenere,
                    trama: rit.data.trama,
                    anno: rit.data.anno,
                    anno_fine: rit.data.anno_fine,
                    n_stagioni: rit.data.n_stagioni,
                    path: rit.data.path,
                    voto: rit.data.voto,
                    film: false,
                    preferito: rit.data.preferito
                }
                for (let i = 1; i <= rit.data!.n_stagioni; i++) {//Faccio un for e riempio l'array delle stagioni
                    this.n_stagioni.push(i)
                }
                this.risorsa = serie
                this.getArrSerie()
            },
            error: (err: any) => {
                console.log('error:', err)
            },
            complete: () => {
                console.log('completato')
            }
        }
    }//Fine osservatore serie

    private ossEpisodi() {//OSservatore per gli episodi
        return {
            next: (rit: I_rispostaserver) => {
                const elem = rit.data
                for (let i = 0; i < elem.length; i++) {
                    const episodio: IEpisodio = {
                        idSerie: elem[i].idSerie,
                        idEpisodio: elem[i].idEpisodio,
                        titolo: elem[i].titolo,
                        durata: elem[i].durata,
                        numero: elem[i].numero,
                        stagione: elem[i].stagione,
                        trama: elem[i].trama,
                        voto: elem[i].voto,
                        path_img: elem[i].path_img,
                        path_video: elem[i].path_video
                    }
                    this.episodi_arr.push(episodio)
                }

            },
            error: (err: any) => {
                console.log('error:', err)
            },
            complete: () => {
                console.log('completato')
            }
        }
    }//Fine osservatore episodi



    //Funzioni di ngbModal
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
