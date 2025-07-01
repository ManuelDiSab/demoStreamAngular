import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, Subject, take, takeUntil, tap, } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { controlCodFiscale, controlloPassword, passwordConfirmationValidator } from 'src/app/_servizi/custom.validator';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { IComune } from 'src/app/interfaces/IComune.interface';
import { INazione } from 'src/app/interfaces/INazione.interface';
import { IRegistrazione } from 'src/app/interfaces/IRegistrazione.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { Gender } from 'src/app/types/Gender.types';
@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.component.html',
    styleUrls: ['./registrazione.component.scss']
})
export class RegistrazioneComponent implements OnInit, OnDestroy {
    auth: BehaviorSubject<Auth>
    private destroy$ = new Subject<void>()
    _ricercaComune: string = '' //Nome del comune di nascita da ricercare
    _ricercaComune2: string = '' //Nome del comune di residenza da ricercare
    siglaAuto:string | unknown = '' //Sigla della provincia
    province: string[] = [] // Array delle provincie
    prov$: Observable<I_rispostaserver> //Obervable delle provincie
    nazioni$: Observable<I_rispostaserver> //Obervable delle nazioni
    eye_icon: string = 'bi-eye-slash-fill'//Icona password non visibile
    eye_icon2: string = 'bi-eye-slash-fill'//Icon passwrod visibile
    bottone: number = 1// Numero del bottone che sta a significare quale form deve mostrare
    reactiveForm: FormGroup //primo form con email
    reactiveForm2: FormGroup //secondo form con dati anagrafici
    reactiveForm3: FormGroup //terzo fom con dati utente 
    cf_value: string = '' //Valore dell'input del codice fiscale
    arr_comuni: IComune[] = [] //Array contenenti i comuni
    arr_comuni2:IComune[] = []
    arr_cap:number[] =[]
    arr_nazioni: INazione[] = [] //Array contenente le nazioni
    nazione_selected: INazione | unknown = null //Nazione selezionata
    comune_selected:null | IComune = null //Comune di nascita selezionato
    comune_selected2:null | IComune = null //Comune di residenza selezionato
    
    constructor(private api:ApiService,private utility:UtilityService,private fb:FormBuilder,private router:Router, private authService:AuthService) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        this.prov$ = this.api.getProvince()
        this.nazioni$ = this.api.getNazioni()
        this.reactiveForm = this.fb.nonNullable.group({
            utente: this.fb.control('', { validators: [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)] },) //Validatori per il campo email (L'email sarà l'utente)
        }),
            this.reactiveForm2 = this.fb.nonNullable.group({
                nome: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(15)] }), //Validatore per il nome
                cognome: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(15)] }), //Validatore per il cognome
                data: this.fb.control('', { validators: [Validators.required] }),//Validatore per la data di nascita
                sesso: this.fb.control('', { validators: [Validators.required] }),//Validatore per il sesso
                comuneNascita: this.fb.control('', { validators: [Validators.required] }),//Validatore per il comune di nascita
                provincia: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2)] }),
                codFis: this.fb.control('', { validators: [Validators.required, controlCodFiscale] })
            }),
            this.reactiveForm3 = this.fb.nonNullable.group({
                tel: this.fb.control('', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern(/^[0-9]/)] }), //Validatore per il numero di telefono
                nazione: this.fb.control('', { validators: [Validators.required] }),//Validatore per il campo nazione 
                cap: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(5)] }),// Validatore per il campo cap(codice postale)
                comune: this.fb.control('', { validators: [Validators.required] }),
                indirizzo: this.fb.control('', { validators: [Validators.required, Validators.minLength(5)] }),
                civico: this.fb.control('', { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(5)] }),
                tipologiaIndirizzo: this.fb.control('', { validators: [Validators.required] }),// Validatore per la tipologia indirizzzo
                password: this.fb.control('', { validators: [Validators.required, Validators.minLength(8), controlloPassword] }),//Validatori per il campo password
                password_confirmation: this.fb.control('', { validators: [Validators.required] })//Validatori per il campo conferma password
            },
                {
                    validators: passwordConfirmationValidator('password', 'password_confirmation')
                })
    }

    ngOnInit(): void {
        if (this.auth.value.token !== null && this.auth.value.status === 1){//Se il token esiste in localStorage(sono logato) e lo staus dell'account
        //è attivo allora non rendo la pagina di registrazione raggiungibile e reindirizzo l'utente nella homepage
            this.router.navigateByUrl('/homepage')
        }
        this.reactiveForm2.get('comuneNascita')?.valueChanges.subscribe(//Faccio ouna sottoscrizione ogni volta che cambia il valore di comuneNascita
            comune => {
                console.log(comune)
            }
        )
        this.prov$.subscribe(this.osservatoreSigla())
        this.nazioni$.subscribe(this.osservatoreNazioni())
    }

    ngOnDestroy(): void {
        this.destroy$.next()
    }

    /**
     * Funzione per inserire in modo automatico la sigla della provincia in base al comune
     * scelto con l'utilizzo di un Subject
     */
    cambioComune() {
        let subComune = new Subject()
        subComune.subscribe(dati => {
            this.siglaAuto = dati//nella sottoscrizione dico che nazione_selected sarà uguale al dato che gli passo
        })
        subComune.next(this.comune_selected?.siglaAuto)//nel next gli passo il prefisso della nazione che scelgo nella select
        this.reactiveForm2.get('provincia')?.setValue(this.comune_selected?.siglaAuto)
    }
    cambioComune2(){
        let subComune2 = new Subject()
        subComune2.subscribe(dati => {
            console.log('subscribe 2', dati)
        })
        if(this.comune_selected2?.multicap == true){
            subComune2.next(this.comune_selected2.capInizio)
            subComune2.next(this.comune_selected2.capFine)
            this.reactiveForm3.get('cap')?.setValue(this.comune_selected2?.cap)
            let inizio = parseInt(this.comune_selected2.capInizio!)
            let fine = parseInt(this.comune_selected2.capFine!)
            this.arr_cap = this.utility.creaRange(inizio, fine)
        }else{  
            
            subComune2.next(this.comune_selected2?.cap)
            this.reactiveForm3.get('cap')?.setValue(this.comune_selected2?.cap)
            this.arr_cap = []
        }
        console.log('comune selected 2', this.comune_selected2?.cap)
    }
    /**
     * Funzione che inserisce in modo automatico il prefisso telefonico corretto
     * al selezionare della nazione
     */
    cambioNazione(){
        let sub = new Subject() //creo un nuovo subject
        sub.subscribe(dati => {
            this.nazione_selected = dati//nella sottoscrizione dico che nazione_selected sarà uguale al dato che gli passo
        })
        sub.next('+'+this.reactiveForm3.controls['nazione'].value.prefisso)//nel next gli passo il prefisso della nazione che scelgo nella select
    }

    /**
     * Funzioni in cui richiamo la funzione listacomuni() e 
     * poi faccio la sottoscrizione all'osservatore per collezionare i comuni
     * richiamando un endpoint api dove faccio una query string passandogli il valore dell'input per 
     * ricercare il nome del comune che si intende trovare
    */
    ricercaComuni(): void {
        this.api.getComuneByNome(this._ricercaComune).subscribe(
            (rit) => {
                if (rit !== null) {
                    this.arr_comuni = rit.data
                }
            }
        )
    }
    ricercaComuni2(): void {
        this.api.getComuneByNome(this._ricercaComune2).subscribe(
            (rit) => {
                if (rit !== null) {
                    this.arr_comuni2 = rit.data  
                }
            }
        )
    }
    /**
     * Prendo il valore dell'input comune reactive form e richiamo
     * la funzione ricercaComuni()
     */
    listacomuni(ricerca:any) {
        this._ricercaComune = ricerca ?? ''
        this.ricercaComuni();
    }
    listacomuni2(ricerca:any) {
        this._ricercaComune2 = ricerca ?? ''
        this.ricercaComuni2();
    }

    /**
     * Funzioni per cambiare il form al click di un pulsante
     * @param name nome del button
     * @return void
     */
    public avanti(): void {
        this.bottone += 1
    }
    public indietro(): void {
        this.bottone -= 1
    }
    /**
     * Funzione per creare il codice fiscale (funzione nell utility service) ed inserirla nell'input del form
     * @param nome nome di battesimo dell'utente
     * @param cognome cognome dell'utente
     * @param comune comune di nascita dell'utente
     * @param data data di nascita dell'utente
     * @param provincia provincia di nascita dell'utente
     * @param sesso seeso dell'utento
     * @return void
    */
    public getCod(nome: string, cognome: string,comune:string, data: string, provincia: string, sesso: Gender): void {
        const cf = this.utility.CodFis(nome, cognome, comune, data, sesso, provincia)
        this.cf_value = cf
        this.reactiveForm2.get('codFis')?.setValue(this.cf_value)

    }
    private osservatore = {
        next: (rit: IRegistrazione) => console.log('ritorno', rit),
        error: (err: string) => console.log('errore:', err),
        complete: () => console.log('completo la registrazione')
    }

    /**
     * Funzione per che manda i dati del form se validi 
     * all api di registrazione della piattaforma
     */
    onSubmit() {
        if (this.reactiveForm.valid && this.reactiveForm2.valid && this.reactiveForm3.valid) {
            //Predo i valori dai campi dei form
            const utente: string = UtilityService.hash(this.reactiveForm.controls['utente'].value)
            const nome: string = this.reactiveForm2.controls['nome'].value
            const cognome: string = this.reactiveForm2.controls['cognome'].value
            const d = this.reactiveForm2.controls['data'].value
            const arr_data: string[] = [d['year'], d['month'], d['day']]
            const dataNascita: string = arr_data.join('-').toString()
            const sesso: string = this.reactiveForm2.controls['sesso'].value.toString()
            const comuneNascita: string = this.reactiveForm2.controls['comuneNascita'].value.nome
            const provincia: string = this.reactiveForm2.controls['provincia'].value
            const codiceFisc: string = this.reactiveForm2.controls['codFis'].value
            const nazione: string = this.reactiveForm3.controls['nazione'].value.idNazione.toString()
            const n_telefono: string = this.reactiveForm3.controls['tel'].value
            const cap: string = this.reactiveForm3.controls['cap'].value
            const indirizzo: string = this.reactiveForm3.controls['indirizzo'].value
            const civico: string = this.reactiveForm3.controls['civico'].value
            const comune_residenza: string = this.reactiveForm3.controls['comune'].value.idComune.toString()
            const tipo_ind: string = this.reactiveForm3.controls['tipologiaIndirizzo'].value.toString()
            const password = UtilityService.hash(this.reactiveForm3.controls['password'].value)
            console.log(utente, nome, cognome, dataNascita, sesso, comuneNascita,provincia,codiceFisc,nazione,n_telefono,cap, indirizzo,civico,comune_residenza, tipo_ind, password )
            //Li inserisco in un oggetto di tipo IRegistrazione (vedi le interface)
            let fd = new FormData()
            fd.append('utente', utente)
            fd.append('nome', nome)
            fd.append('cognome', cognome)
            fd.append('dataNascita', dataNascita)
            fd.append('sesso', sesso)
            fd.append('comuneNascita', comuneNascita)
            fd.append('provincia', provincia)
            fd.append('codFis', codiceFisc)
            fd.append('nazione', nazione)
            fd.append('tel', n_telefono)
            fd.append('cap', cap)
            fd.append('indirizzo', indirizzo)
            fd.append('civico', civico)
            fd.append('comune', comune_residenza)
            fd.append('tipologiaIndirizzo', tipo_ind)
            fd.append('password', password)
            fd.append('password_confirmation', password)
            if (fd !== null) {
                this.obsRegistrazione(fd).subscribe(this.osservatore)
                this.router.navigateByUrl('/login')
            } else {
                console.error('Dati di registrazione nulli')
            }
        } else {
            console.log('il Form non è valido')
        }
    }


    /**
     * Funzione che mostra o nasconde il campo password interessato
     * 
     * @param input HTMLInputElement (password)
     */
    vedoNonVedo(input: HTMLInputElement): void {
        if (input.type === 'password') {
            input.type = 'text'
            input.autocomplete = 'off'
            if (input.id === 'password') {
                this.eye_icon = 'bi-eye-fill'
            } else {
                this.eye_icon2 = 'bi-eye-fill'
            }
        } else if (input.type === 'text') {
            input.type = 'password'
            if (input.id === 'password') {
                this.eye_icon = 'bi-eye-slash-fill'
            } else {
                this.eye_icon2 = 'bi-eye-slash-fill'
            }
        }
    }

    //Osservatore per le sigle delle provincie
        osservatoreSigla() {
            return {
                next: (rit: I_rispostaserver) => {
                    const elem = rit.data
                    const tmp: string[] = []
                    for (let i = 0; i < elem.length; i++) {
                        tmp.push(elem[i].siglaAuto)
                    }
                    this.province = tmp
                },
                error: (err: any) => {
                    console.log('error:', err)
                },
                complete: () => {
                    console.log('completato')
                }
            }
        }

    //Osservatore per le sigle delle nazioni
    osservatoreNazioni() {
        return {
            next: (rit: I_rispostaserver) => {
                const elem = rit.data
                for (let i = 0; i < elem.length; i++) {
                    const tmp: INazione = {
                        idNazione: elem[i].idNazione,
                        nome: elem[i].nome,
                        prefisso: elem[i].PrefissoTelefonico
                    }
                    this.arr_nazioni.push(tmp)
                }
            }, error: (err: any) => {
                console.log('error:', err)
            }, complete: () => {
                console.log('completato')
            }
        }
    }

    //Osservatore della registrazione
    obsRegistrazione(dati: FormData) {
        return this.api.register(dati).pipe(
            take(1),
            tap(x => console.log('Obs reg', x)),
            map(x => x.data),
            takeUntil(this.destroy$))
    }

}
