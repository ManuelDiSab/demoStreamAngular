import { Component, inject, OnDestroy, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { utente } from 'src/app/types/Utente.type';
import { IUser } from 'src/app/interfaces/IUser.interface';
import { IAnagrafica } from 'src/app/interfaces/IAnagraficaUtente.interface';
import { IRecapito } from 'src/app/interfaces/IRecapito.interface';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { controlCodFiscale, controlloPassword, passwordConfirmationValidator } from 'src/app/_servizi/custom.validator';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { IComune } from 'src/app/interfaces/IComune.interface';
import { IIndirizzo } from 'src/app/interfaces/IIndirizzo.interface';
import { INazione } from 'src/app/interfaces/INazione.interface';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';

@Component({
    selector: 'app-mio-profilo',
    templateUrl: './mio-profilo.component.html',
    styleUrls: ['./mio-profilo.component.scss']
})
export class MioProfiloComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>()
    n_form: number = 0
    arr_comuni: IComune[] = []
    arr_nazioni: INazione[] = []
    multicap: number[] = []
    risorsa: utente | null = null
    utente$: Observable<I_rispostaserver>
    anagrafica$: Observable<I_rispostaserver>
    indirizzi$: Observable<I_rispostaserver>
    recapiti$: Observable<I_rispostaserver>
    user: IUser | null = null
    anag: IAnagrafica | null = null
    indirizzi: IIndirizzo | null = null
    recap: IRecapito | null = null
    auth: BehaviorSubject<Auth>
    form_info: FormGroup
    form_recap: FormGroup
    form_nome: FormGroup
    form_ind: FormGroup
    form_password: FormGroup
    private modalService = inject(NgbModal);
    closeResult: WritableSignal<string> = signal('');
    constructor(private api: ApiService, private authService: AuthService, private router: Router, private fb: FormBuilder, private utility: UtilityService,
        private osserv: OsservatoriService) {
        this.utente$ = this.api.getUserProfile()
        this.anagrafica$ = this.api.getUserAnagrafica()
        this.indirizzi$ = this.api.getUserIndirizzo()
        this.recapiti$ = this.api.getUserRecapiti()
        this.auth = this.authService.LeggiObsAuth()//Vedo se sono loggato

        this.form_recap = this.fb.nonNullable.group({
            telefono: this.fb.control('', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern(/^[0-9]/)] }),
        })

        this.form_nome = this.fb.nonNullable.group({
            nome: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(15)] }),
            cognome: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(15)] }),
        })

        this.form_info = this.fb.nonNullable.group({
            data: this.fb.control('', { validators: [Validators.required] }),
            comuneNascita: this.fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
            codFis: this.fb.control('', { validators: [Validators.required, controlCodFiscale] })

        })
        this.form_ind = this.fb.nonNullable.group({
            indirizzo: this.fb.control('', { validators: [Validators.required, Validators.minLength(5)] }),
            comune: this.fb.control('', { validators: [Validators.required, Validators.minLength(5)] }),
            civico: this.fb.control('', { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(5)] }),
            provincia: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2)] }),
            nazione: this.fb.control('', { validators: [Validators.required] }),
            cap: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(5)] }),
            tipologia: this.fb.control('', { validators: [Validators.required] })
        })
        this.form_password = this.fb.nonNullable.group({
            password: this.fb.control('', { validators: [Validators.required] }),
            new_password: this.fb.control('', { validators: [Validators.required, Validators.minLength(8), controlloPassword] }),
            new_password_confirmation: this.fb.control('', { validators: [Validators.required] })//Validatori per il campo conferma password
        },
            {
                validators: passwordConfirmationValidator('new_password', 'new_password_confirmation')
            })
    }
    ngOnInit(): void {
        if (this.auth.value.token == null || this.auth.value.token == '') {
            this.router.navigateByUrl('/login')
        }
        //Da controllare in console
        this.recapiti$.subscribe(rit => { this.recap = rit.data.tel, console.log(rit.data.tel) })
        this.utente$.subscribe(rit => this.user = rit.data)
        this.indirizzi$.subscribe(this.ossIndirizzi())
        this.anagrafica$.subscribe(rit => this.anag = rit.data)
    }
    ngOnDestroy(): void {
        this.destroy$.next()
    }


    eliminaUser(id:string){
        let num_id = parseInt(id)
        let api_cancella = this.api.deleteUserProfile()
        api_cancella.subscribe(
            rit => {
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
      this.router.navigateByUrl('/register')}
        )
    }

    /**
     * Funzione per modificare i propri dati anagrafici 
     * @returns void
     */
    modificaInfo(): void {
        const d = this.form_info.get('data')?.value
        const arr_data: string[] = [d['year'], d['month'], d['day']]
        const dataNascita: string = arr_data.join('-').toString()
        let obj = { //Data di nascita, comune di nascita e codice fiscale 
            dataNascita: dataNascita,
            comuneNascita: this.form_info.get('comuneNascita')?.value.nome,
            cod_fis: this.form_info.get('codFis')?.value,
        }
        this.api.ModificaUserAnagrafica(obj).subscribe(this.osservatoreupdateAnagrafica())
    }

    /**
     * Funzione per modificare nome e cognome
     * @returns void
     */
    modificaNominativo(): void {
        let obj = { //Nome e cognome 
            nome: this.form_nome.get('nome')?.value,
            cognome: this.form_nome.get('cognome')?.value
        }
        this.api.modicaUserProfile(obj).subscribe(this.osservatoreupdateNominativo())
    }

    /**
     * Funzione per modificare i recapiti
     * @returns void
     */
    modificaRecapito(): void {
        let obj = {//Recapito telefonico
            tel: this.form_recap.get('telefono')?.value,
        }
        this.api.updateUserRecapiti(obj).subscribe(this.osservatoreupdateRecapiti())
    }

    /**
     * Funzione per modificare i dati degli indirizzi
     * @returns void
     */
    modificaIndirizzo(): void {
        let obj = {
            indirizzo: this.form_ind.get('indirizzo')?.value,
            comune: this.form_ind.get('comune')?.value.nome,
            idComune: this.form_ind.get('comune')?.value.idComune,
            civico: this.form_ind.get('civico')?.value,
            provincia: this.form_ind.get('provincia')?.value,
            idNazione: this.form_ind.get('nazione')?.value.idNazione,
            cap: this.form_ind.get('cap')?.value.toString(),
            idTipologiaIndirizzo: this.form_ind.get('tipologia')?.value
        }
        this.api.modificaIndirizzo(obj).subscribe(this.osservatoreupdateIndirizzi())
        // this.indirizzi$.subscribe(this.ossIndirizzi())
    }


    private obsCambioPSW(password: string, newPsw: FormData): Observable<I_rispostaserver> {
        return this.api.cambioPasswordFinale(password, newPsw).pipe(
            take(1)
        )
    }

    /**
     * Modifica per modificare la password dopo che aver inserito quella corretta
     * @@returns void
     */
    modificaPassword() {
        if (this.form_password.invalid) {
            console.log('form invalido')
        } else {
            console.log('Form valido')
            // const password = UtilityService.hash(this.form_password.get('password')?.value)
            const password = this.form_password.get('password')?.value

            let obj = new FormData
            obj.append('new_password', UtilityService.hash(this.form_password.get('new_password')?.value))
            obj.append('new_password_confirmation', UtilityService.hash(this.form_password.get('new_password')?.value))
            //Faccio l'hash da client e quindi mando la nuova password e la sua conferma già criptate per motivi di sicurezza 
            this.obsCambioPSW(password, obj).subscribe()
        }
    }

    /**
     * Funzione per ricercare la nazione nel form di modifica degli indirizzi   
     * @param string parametr di ricerca 
     * @returns void
     */
    cercaNazioni(string: string): void {
        console.log('ricerca', string)
        this.api.getNazioniByNome(string).subscribe(this.osserv.osservatoreNazioni(this.arr_nazioni))
    }

    /**
     * Funzione per ricercare il comune di residenza nel form di modifica degli indirizzi   
     * @param string parametr di ricerca 
     * @returns void
     */
    cercaComune(string: string): void {
        console.log('ricerca', string)
        this.api.getComuneByNome(string).subscribe(
            rit => {
                console.log('rit comune', rit.data)
                this.arr_comuni = rit.data
            }
        )
    }

    /**
     * Funzione per settare la provincia nel form di modifica
     * @returns void
     * 
     */
    setProvincia():void{
        this.form_ind.get('provincia')?.setValue(this.form_ind.get('comune')?.value.siglaAuto)
        this.form_ind.get('cap')?.setValue(this.form_ind.get('comune')?.value.cap)
        if (this.form_ind.get('comune')?.value.multicap !== '0') {
            const capFine = this.form_ind.get('comune')?.value.capFine
            const capInizio = this.form_ind.get('comune')?.value.capInizio
            const arr = this.utility.creaRange(capInizio, capFine)
            this.multicap = arr
            console.log('sicap')
        }else{
            this.multicap = []
            console.log('nocap')
        }
    }

    /**
     * Funzione per settare i valori degli input con le informazioni in DB
     * @param number numero del form da settare
     * @returns void
     */
    setNform(number: number): void {
        this.n_form = number
    }

    /**
     * Funzione per settare il form in base al parametro che si vuole modificare
     * @param string nome del parametro da modificare
     * @param value Valore da modificare che viene inserito nell'input
     * @returns void
     */
    inserimentoDati(n: number): void {
        switch (n) {
            case 1:
                let date = new Date(this.anag!.dataNascita)
                let newDate = { year: date.getFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() }
                this.form_info.get('data')?.setValue(newDate),
                    this.form_info.get('comuneNascita')?.setValue(this.anag?.comuneNascita),
                    this.form_info.get('codFis')?.setValue(this.anag?.cod_fis)
                break;
            case 2:
                this.form_ind.get('indirizzo')?.setValue(this.indirizzi?.indirizzo)
                this.form_ind.get('civico')?.setValue(this.indirizzi?.civico)
                this.form_ind.get('comune')?.setValue(this.indirizzi?.comune)
                this.form_ind.get('provincia')?.setValue(this.indirizzi?.provincia)
                this.form_ind.get('cap')?.setValue(this.indirizzi?.cap)
                this.form_ind.get('nazione')?.setValue(this.indirizzi?.nazione),
                    this.form_ind.get('tipologia')?.setValue(this.indirizzi?.idTipo)
                if (this.indirizzi?.multicap) {
                    this.multicap = this.utility.creaRange(this.indirizzi.capInizio!, this.indirizzi.capFine!)
                } else {
                    console.log(this.multicap, 'no multicap')
                }
                break;
            case 4:
                this.form_nome.get('nome')?.setValue(this.user?.nome)
                this.form_nome.get('cognome')?.setValue(this.user?.cognome)
                break;
            case 5:
                this.form_recap.get('telefono')?.setValue(this.recap)
                break;
        }
    }


    //################################################   OSSERVATORI PER GLI UPDATE    #################################################


    /**
    * Osservatore per l'update dei recapiti all'interno del pannello 'recapiti' 
    * con creazione di un alert personalizzato al compimento o fallimento dell'update e per 
    * disporre su schermo i nuovi dati modificati
    */
    public osservatoreupdateRecapiti() {
        return {
            next: (rit: I_rispostaserver) => {
                this.recap = rit.data.tel
            },
            error: (err: string) => { console.log(err), this.utility.creaAlert(false, 'UPDATE') },
            complete: () => { this.utility.creaAlert(true, 'UPDATE'), console.log('') }
        }
    }


    /**
    * Osservatore per l'update dei dati all'interno del pannello 'nominativo
    * ' 
    * con creazione di un alert personalizzato al compimento o fallimento dell'update e per 
    * disporre su schermo i nuovi dati modificati
    */
    public osservatoreupdateNominativo() {
        return {
            next: (rit: I_rispostaserver) => {
                this.user!.nome = rit.data.nome,
                    this.user!.cognome = rit.data.cognome
            },
            error: (err: string) => { console.log(err), this.utility.creaAlert(false, 'UPDATE') },
            complete: () => { this.utility.creaAlert(true, 'UPDATE'), console.log('') }
        }
    }


    /**
    * Osservatore per l'update dei dati all'interno del pannello 'indirizzo' 
    * con creazione di un alert personalizzato al compimento o fallimento dell'update e per 
    * disporre su schermo i nuovi dati modificati
    */
    public osservatoreupdateIndirizzi() {
        return {
            next: (rit: I_rispostaserver) => {
                this.indirizzi!.comune = rit.data.comune,
                    this.indirizzi!.cap = rit.data.cap,
                    this.indirizzi!.civico = rit.data.civico,
                    this.indirizzi!.provincia = rit.data.provincia,
                    this.indirizzi!.indirizzo = rit.data.indirizzo,
                    this.indirizzi!.nazione = rit.data.nazione,
                    this.indirizzi!.idTipo = rit.data.idTipologiaIndirizzo,
                    this.indirizzi!.tipo = rit.data.tipologia,
                    this.indirizzi!.multicap = rit.data.multicap,
                    this.indirizzi!.capFine = rit.data.capFine,
                    this.indirizzi!.capInizio = rit.data.capInizio

            },
            error: (err: string) => { console.log(err), this.utility.creaAlert(false, 'UPDATE') },
            complete: () => { this.utility.creaAlert(true, 'UPDATE'), console.log('') }
        }
    }


    /**
     * Osservatore per l'update dei dati all'interno del pannello 'info personali' 
     * con creazione di un alert personalizzato al compimento o fallimento dell'update e per 
     * disporre su schermo i nuovi dati modificati
     */
    public osservatoreupdateAnagrafica() {
        return {
            next: (rit: I_rispostaserver) => {
                this.anag!.cod_fis = rit.data.cod_fis,
                    this.anag!.dataNascita = rit.data.dataNascita,
                    this.anag!.comuneNascita = rit.data.comuneNascita
            },
            error: (err: string) => { console.log(err), this.utility.creaAlert(false, 'UPDATE') },
            complete: () => { this.utility.creaAlert(true, 'UPDATE'), console.log('') }
        }
    }


    /**
     * Osservatore inserire i dati all'interno di un oggetto chiamato 'indirizzi' per disporre dinamicamnete le informazioni
     * personali nel pannello 'indirizzo'
     * @returns 
     */
    ossIndirizzi() {
        return {
            next: (rit: I_rispostaserver) => {
                this.indirizzi = {
                    comune: rit.data[1].nome,
                    nazione: rit.data[0].nome,
                    cap: rit.data[2].cap,
                    idUser: rit.data[2].idUser,
                    indirizzo: rit.data[2].indirizzo,
                    provincia: rit.data[2].provincia,
                    civico: rit.data[2].civico,
                    idNazione: rit.data[2].idNazione,
                    tipo: rit.data[2].tipologia,
                    idTipo: rit.data[2].idTipologiaIndirizzo,
                    multicap: rit.data[1].multicap,
                    capFine: rit.data[1].capFine,
                    capInizio: rit.data[1].capInizio
                }
                console.log('indirizzo', this.indirizzi)
            },
            error: (err: any) => {
                console.log('error:', err)
            },
            complete: () => {
                console.log('completato')
            }
        }
    }








    /**
     * Funzioni relative all aperura e chiusura delle modal 
     */
    open(content: TemplateRef<any>) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            (result) => {
                this.closeResult.set(`Closed with: ${result}`);
            },
            (reason) => {
                this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
            },
        );
    }

    private getDismissReason(reason: any): string {
        switch (reason) {
            case ModalDismissReasons.ESC:
                return 'by pressing ESC';
            case ModalDismissReasons.BACKDROP_CLICK:
                return 'by clicking on a backdrop';
            default:
                return `with: ${reason}`;
        }
    }

}
