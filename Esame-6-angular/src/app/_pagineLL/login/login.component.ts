import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, delay, Observable, Observer, of, Subject, take, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { Auth } from 'src/app/interfaces/IAuth.interface';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit, OnDestroy {
    isAttivo:boolean = true
    isAutenticato: boolean = true
    reactiveForm: FormGroup
    auth: BehaviorSubject<Auth>
    private distruggi$ = new Subject<void>()    

    constructor(private fb: FormBuilder, private router: Router, private api: ApiService, private authService: AuthService) {
        this.reactiveForm = this.fb.group({
            'utente': ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],//Validatori per il campo utente
            'password': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]//Validatori per il campo password
        })

        this.auth = this.authService.LeggiObsAuth()// Con questa comando posso sapere se siamo autorizzati o meno
        console.log('Auth:', this.auth)
    }
    ngOnInit(): void {
        
        
    }
    ngOnDestroy(): void {
        this.distruggi$.next()
    }

        
    accedi(): void {
        console.log('ACCEDI 1')
        if (this.reactiveForm.invalid) {
            console.log('Form non valido')
        } else {
            let utente = this.reactiveForm.controls['utente'].value //Prendo il valore del campo utente
            let password = this.reactiveForm.controls['password'].value // Prendo il valore del campo password
            this.isAutenticato = true
            this.obsLogin(utente, password).subscribe(this.osservoLogin())
            console.log('ACCEDI 2', utente, password)
        }
    }


    private obsLogin(utente: string, password: string): Observable<I_rispostaserver> {
        return this.api.login(password, utente).pipe(
            delay(1000),
            take(1),
            catchError((err, caught) => {
                console.log('errore caught: ', err, caught)
                const nuovo: I_rispostaserver = {
                    data: null,
                    message: 'Errore nel login(obsLogin)',
                    error: err
                }
                return of(nuovo)// Uso of per farlo diventare un observable
            }),
            takeUntil(this.distruggi$)
        )
    }


    private osservoLogin() {
        const osservatore: Observer<any> = {
            next: (rit: I_rispostaserver) => {
                console.log('ritorno osservo login:', rit)
                if (rit.data !== null && rit.message !== null) {
                        const token: string = rit.data.tk
                        const contenutoTK = UtilityService.LeggiToken(token)
                        if(contenutoTK.data.status != 1){
                            this.isAttivo = false
                            rit.message = 'Il tuo account non è attivo'
                        }else{
                            const Auth: Auth = {
                                token: token,
                                nome: contenutoTK.data.nome,
                                idRuolo: contenutoTK.data.idRuolo,
                                status: contenutoTK.data.status,
                                nazione: contenutoTK.data.nazione,
                                idUser: contenutoTK.data.idUser,
                                sesso: contenutoTK.data.sesso
                            }
                            this.isAttivo = true
                            this.authService.settaObsAuth(Auth)
                            this.authService.scriviAuthSuLocalStorage(Auth)
                            this.router.navigateByUrl('/homepage')//Reindirizzo sulla homepage 
                        }
                } else {
                    console.log('Errore in osservoLogin')
                }
                this.isAutenticato = false
            },
            error: (err) => {
                console.log('errore', err)
                const auth: Auth = {
                    token: null,
                    nome: null,
                    idRuolo: null,
                    status: null,
                    nazione: null,
                    idUser: null,
                    sesso: null
                }
                this.isAutenticato = false
                this.authService.settaObsAuth(auth)
            },
            complete: () => {
                this.isAutenticato = false
                console.log('completato')
            }
        }
        return osservatore
    }

}
