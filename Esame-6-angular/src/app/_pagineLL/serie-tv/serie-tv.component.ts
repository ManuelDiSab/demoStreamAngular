import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';
@Component({
    selector: 'app-serie-tv',
    templateUrl: './serie-tv.component.html',
    styleUrls: ['./serie-tv.component.scss']
})
export class SerieTvComponent implements OnInit {
    auth: BehaviorSubject<Auth>
    serie$:Observable<I_rispostaserver>
    serie:ISerie[] = []
    s_azione:ISerie[] = []

    constructor(private router: Router, private authService: AuthService, private api:ApiService, private oss:OsservatoriService) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        this.serie$ = this.api.getSerieTvTotali()
    }

    ngOnInit(): void {
        if (this.auth.value.token == null || this.auth.value.token == '') {
            this.router.navigateByUrl('/login')
        }   
        this.serie$.subscribe(this.oss.osservatore_serie(this.serie))

    }
}
