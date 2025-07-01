import { Component, inject, OnInit, PipeTransform, signal, TemplateRef, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, filter, map, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { IUser } from 'src/app/interfaces/IUser.interface';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: ['./gestione-utenti.component.scss']
})
export class GestioneUtentiComponent implements OnInit {
    auth: BehaviorSubject<Auth>
    utenti$: Observable<I_rispostaserver>
    arr_utenti: IUser[] = []
    ricerca_utente:string = ''
    filter_form:FormGroup
    private distruggi$ = new Subject<void>()
    private modalService = inject(NgbModal);
    closeResult: WritableSignal<string> = signal('');
    obj_select = [
        {
            label: 'Tutti',
            value: null
        },
        {
            label: 'Inattivi',
            value: 'inattivi'
        },
        {
            label: 'Attivi',
            value: 'attivi'
        }
    ]

    constructor(private api: ApiService, private fb:FormBuilder, private authService:AuthService, private oss:OsservatoriService) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
        this.utenti$ = this.api.getListaUtenti()
        this.filter_form = this.fb.nonNullable.group({
            search:this.fb.control('', { validators: [Validators.required] }),
        })
    }
    

    ngOnInit(): void {
        this.utenti$.subscribe(this.osservatoreUtenti())
        this.filter_form.get('search')?.valueChanges.subscribe(rit => this.ricerca_utente = rit)
        
    }

    /**
     * Funzione per ricercare gli utenti per nome e cognome
     * @return void
    */
    ricercaUtenti(){
        if(this.ricerca_utente != ''){
            this.api.ricercaUtenti(this.ricerca_utente).subscribe(rit => this.arr_utenti = rit.data)
        }else{
            this.utenti$.subscribe(this.osservatoreUtenti())
        }
        
    }   

    /**
    * Funzione per cambiare lo status di un utente
    * @param id ID dell'utente
    * @param status Status attuale dell'utente 
    */
    cambiaStatus(id: string, status: string): void {

        console.log('ciao', id, status)
        switch (status) {
            case 'inattivo': //Se lo status è uguale a 0
            console.log('caso 0')
                this.arr_utenti = []
                let dato: Partial<IUser> = { status: '1' }
                this.api.UpdateStatusUtente(id, dato).pipe(
                    tap(x => console.log('dati tap: ', x)),
                    take(1),
                    map(x => x.data),
                    takeUntil(this.distruggi$)
                ).subscribe()
                this.utenti$.subscribe(this.osservatoreUtenti())
                break;
            case 'attivo': //Se lo status è uguale 1
                console.log('caso 1')
                this.arr_utenti = []
                let dato2 = { status: '0' }
                this.api.UpdateStatusUtente(id, dato2).pipe(
                    tap(x => console.log('dati tap: ', x)),
                    take(1),
                    map(x => x.data),
                    takeUntil(this.distruggi$)
                ).subscribe()
                this.utenti$.subscribe(this.osservatoreUtenti())
                break;
        }
    }   
    /**
     * Funzione per eliminare l'utente scelto
     * @param id ID dell'utente
     * @return void
     */
    eliminaUtente(id:string):void{
        this.api.deleteUserProfileAdmin(id).subscribe(this.oss.osservatoreGestione('DELETE',null))
        this.api.getListaUtenti().subscribe(this.osservatoreUtenti())
    }



    /**
     * Funzione per visualizzare gli utenti in base allo status
     * @param num (number | string | null) 
     * @return void
     */
    selectUtentiByStatus(num: number |string | null): void {
        this.arr_utenti = []
        if (num != null) {
            this.api.getListaUtentiByStatus(num).subscribe(this.osservatoreUtenti())
        } else {
            this.utenti$.subscribe(this.osservatoreUtenti())
        }
    }
    


        osservatoreUtenti(){
        return {
            next:(rit:I_rispostaserver)=>{
                this.arr_utenti = []
                const elem = rit.data
                for(let i =0; i < elem.length; i++){
                    let utente:IUser = {
                        nome:elem[i].nome,
                        cognome:elem[i].cognome,
                        idUser:elem[i].idUser,
                        idRuolo:elem[i].idRuolo,
                        ruolo:elem[i].ruolo,
                        n_status:elem[i].status,
                        status:elem[i].nome_status
                    }
                    this.arr_utenti.push(utente)
                    
                }
            },
            error:(error:string)=>{
                console.log('errore oss user', error)
            },
            complete:()=>{
                console.log('osservatore user completato')
            }
        }
    }




    /**
     * Funzione per aprire la modal richisesta
     * @param content modal da aprire 
     * @return void
     */
    open(content: TemplateRef<any>):void{
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
