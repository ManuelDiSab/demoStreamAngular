import { Component, inject, OnDestroy, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { IGen } from 'src/app/interfaces/IGenere.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
interface IPaginazione {
    nome:string,
    idGenere:number,
    id?:number
}
@Component({
    selector: 'app-gestione-generi',
    templateUrl: './gestione-generi.component.html',
    styleUrls: ['./gestione-generi.component.scss']
})
export class GestioneGeneriComponent implements OnInit,OnDestroy {

    private distruggi$ = new Subject<void>()
    private modalService = inject(NgbModal);
    closeResult: WritableSignal<string> = signal('');
    page:number = 1;
	pageSize:number = 10;
    collectionSize:number = 0
    generi$: Observable<I_rispostaserver>
    arr_generi: IGen[] = []
    generi:IPaginazione[] = []
    filter_form: FormGroup
    form_gen:FormGroup
    n_form: number = 0
    idGenere:string = ''
    ricerca:string = ''
    constructor(private api: ApiService, private fb: FormBuilder, private utility:UtilityService) {
        this.generi$ = this.api.getGenere()
        this.filter_form = this.fb.nonNullable.group({
            search: this.fb.control('', { validators: [Validators.required] }),
            paginazione:''
        })
        this.form_gen = this.fb.nonNullable.group({
            genere: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
        })
    }

    ngOnInit(): void {
        this.generi$.subscribe(rit => { this.arr_generi = rit.data, this.collectionSize = this.arr_generi.length, this.refreshPaginazione()})
        this.filter_form.get('search')?.valueChanges.subscribe(rit=>console.log('search',rit))
        console.log(this.collectionSize)
    }
    ngOnDestroy(): void {
        this.distruggi$.next()
    }
    /**
     * Funzione per cercare un genere attraverso il nome
     * @returns void
     */
    ricercaGeneri():void{
        let table = document.getElementById('tbody')
        let tr = table!.getElementsByTagName("tr");
        for (let i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td")[1];
            if (td) {
              let txtValue = td.innerHTML.toLowerCase().trim()
              if (txtValue.includes(this.ricerca.toLowerCase())) {
                console.log('inner', txtValue)
                tr[i].style.display = "";
              }else {
                tr[i].style.display = "none";
              }
            }       
        }
    }

    /**
     * Funzione per aggiungere un nuovo genere
     * @returns voids
     */
    aggiungiGenere():void{
        let fd = new FormData()
        fd.append('nome',this.form_gen.get('genere')?.value)
        this.api.postgenere(fd).subscribe(this.osservatore('POST'))
    }

    /**
     * Funzione per modificare il genere scelto 
     * @returns void
    */
    modificaGenere():void {
        let obj = {
            nome:this.form_gen.get('genere')?.value
        }
        this.api.updateGenere(obj, this.idGenere).pipe(
            takeUntil(this.distruggi$)
        ).subscribe(this.osservatore('UPDATE'))
    }

    /**
     * Funzione per impostare il valore di input del form
     * di modifica con il nome del genere
     * @param id ID del genere 
     * @returns void
     */
    setGenere(id:string):void{
        this.api.getGenereById(id).subscribe(
            rit => {
                this.form_gen.get('genere')?.setValue(rit.data.nome)
            }
        )
        this.idGenere = id
    }
    /**
     * Funzione per eliminare il genere scelto
     * @returns void
     */
    eliminaGenere(id:string):void {
        console.log('idGenere',id)
        this.api.deleteGenere(id).subscribe(this.osservatore('DELETE'))
    }

    /**
     * Funzione per impostare il form in base alla stringa passata
     * @param string stringa per impostare n_form 
     */
    setForm(string: string) {
        if (string === 'add') {
            this.n_form = 1
        } else if (string === 'mod') {
            this.n_form = 2
        }
    }   

    private osservatore(string:'POST'|'DELETE'|'UPDATE'){
        return {
            next: (rit:I_rispostaserver) => {
                this.arr_generi = rit.data, 
                this.collectionSize = this.arr_generi.length, 
                this.refreshPaginazione()
            },
            error: (err: string) => {console.log('errore:', err), this.utility.creaAlert(false,string)},
            complete: () =>{ this.utility.creaAlert(true,string) }
        }
    }

    
    refreshPaginazione() {
		this.generi = this.arr_generi.map((generi, i) => ({id:i + 1,  ...generi })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}

    //Funzioni per NgModal
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
