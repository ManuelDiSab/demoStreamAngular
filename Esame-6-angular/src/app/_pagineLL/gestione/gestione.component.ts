import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, filter, map, Observable, Subject, Subscription, take, takeUntil, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { IGen } from 'src/app/interfaces/IGenere.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { IUser } from 'src/app/interfaces/IUser.interface';

@Component({
    selector: 'app-gestione',
    templateUrl: './gestione.component.html',
    styleUrls: ['./gestione.component.scss']
})
export class GestioneComponent implements OnInit {
    auth: BehaviorSubject<Auth>
    closeResult = '';
    arr_utenti:number | null=  null
        arr_voci_scelta = [
        // {nome:'piattaforma', url:'/gestione', icona:'bi bi-gear-fill'},
        {nome:'utenti',url:'utenti',icona:'bi bi-people-fill'},
        {nome: 'film',url:'film', icona:'bi bi-camera-reels-fill'},
        {nome:'serie-tv',url:'serie',icona:'bi bi-tv-fill'},
        {nome:'generi', url:'generi', icona:'bi bi-film'}
    ] //Array con le voci della prima select
    constructor(private api: ApiService, private authService: AuthService, private router: Router) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
    }
    ngOnInit(): void {
        if (this.auth.value.token == null || this.auth.value.token == '') {//Se non sono loggato vengo rimandato al login
            this.router.navigateByUrl('/login')
        }
        if (this.auth.value.idRuolo !== 2) { // Se non sono un admin vengo rimandato alla homepage
            this.router.navigateByUrl('/homepage')
        }
        
    }

   
}

