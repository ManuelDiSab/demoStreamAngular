import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concatMap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';
import { IVoce } from 'src/app/interfaces/IVoci.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu-laterale',
    templateUrl: './menu-laterale.component.html',
    styleUrls: ['./menu-laterale.component.scss']
})
export class MenuLateraleComponent implements OnInit {
    auth: BehaviorSubject<Auth>
    valore_ricerca: string = ''
    form_ricerca = this.fb.nonNullable.group({
        valore_ricerca: ''
    })
    voci_menu: string[] = ['Home', 'Film', 'Serie', 'Preferiti', 'Profilo'] //Array contenente le label dei link
    arr_link: string[] = ['homepage', 'film', 'serie', 'mia-lista', 'mio-profilo'] //Array contenenti i path dei link
    arr_icon: string[] = ['bi bi-house', 'bi bi-camera-reels', 'bi bi-tv', 'bi bi-star', 'bi bi-person'] //array contenente le icon dei link
    logo: string = "../../../assets/img/strem-viola.png" //path del logo 
    logo_piccolo: string = "../../../favicon.ico" //path della favicon 
    arr_obj: IVoce[] = [] //Array di interfacce IVoce
    obj_admin: IVoce = { icon: 'bi bi-archive', label: 'Gestione', route: 'gestione/utenti' } //Interfaccia IVoce visualizzata solo da admin
    closeResult = '';
    arr_film: IFilm[] = []
    arr_serie: ISerie[] = []
    au = localStorage.getItem('auth')
    @Input({ required: true }) isLeftSidebarCollapsed!: boolean
    @Output('changeIsLeftSidebarCollapsed') event = new EventEmitter()

    constructor(private authService: AuthService, private modalService: NgbModal, private api: ApiService, private fb: FormBuilder, private router: Router) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        let au = localStorage.getItem('token')
    }

    ngOnInit(): void {
        for (let i = 0; i < this.voci_menu.length; i++) {//Faccio un for per inserire gli elementi all'interno di arr_obj
            let tmp: IVoce = {
                label: this.voci_menu[i],
                route: this.arr_link[i],
                icon: this.arr_icon[i]
            }
            this.arr_obj.push(tmp)
        }
            
        this.form_ricerca.get('valore_ricerca')?.valueChanges.subscribe(//Faccio una sottoscrizione ogni volta che il valore
            //  dell'input di ricerca cambia (ogni volta che viene inserito o cancellato un carattere )
            rit => {
                this.valore_ricerca = rit

            }
        )
    }

    /**
     * 
     * @returns void
     */
    toggleCollapse(): void {
        this.event.emit(!this.isLeftSidebarCollapsed)
    }

    /**
     * Funzione per chiudere la navBar laterale
     * @returns void
     */
    closeNav(): void {
        this.event.emit(true)
    }

    /**
     * Funzione per effettuare un logout dalla piattaforma
     * eliminando il contenuto del local storage e settando auth a null
     * @returns void 
     */
    logout(): void {
        this.authService.eliminaAuthSuLocalStorage()
        let Auth ={
        idUser: null,
        idRuolo: null,
        status: null,
        token: null,
        nome: null,
        nazione: null,
        sesso: null
      }
      this.authService.settaObsAuth(Auth)
    }

    /**
     * Funzione per espandere la navbar 
     * @returns string
     */
    espandi() {
        if (this.isLeftSidebarCollapsed) {
            return 'parziale'
        } else {
            return 'completa'
        }
    }
    onSubmit(): void {
        this.router.navigateByUrl('ricerca/' + this.valore_ricerca)
        this.valore_ricerca = ''
    }

    /**
     * Funzione per ricercare i film e le serie all'interno della searchbar
     * @returns void
     */
    ricercaProdotti(): void {
        const film$ = this.api.getFilmPerNome(this.valore_ricerca)
        const serie$ = this.api.getSeriePerNome(this.valore_ricerca)
        film$.subscribe(rit => {
            if (rit !== null) {
                this.arr_film = rit.data
            } else {
                this.arr_film = []
            }
        })
        serie$.subscribe(rit => {
            if (rit !== null) {
                this.arr_serie = rit.data
            } else {
                this.arr_serie = []
            }
        })
    }

    /**
     * Funzione per aprire la modal contenente la searchbar
     * @param content TemplateRef
     * @returns void
     */
    open(content: TemplateRef<any>): void {
        this.modalService.open(content, { size: 'lg' }).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            },
        );
    }

    /**
     * Funzione per la chiusura della modal
     * @param reason 
     * @returns string
     */
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
