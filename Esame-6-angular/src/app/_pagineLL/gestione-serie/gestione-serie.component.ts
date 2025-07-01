import { Component, inject, OnDestroy, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { IEpisodio } from 'src/app/interfaces/IEpisodi.interface';
import { IGen } from 'src/app/interfaces/IGenere.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';

@Component({
    selector: 'app-gestione-serie',
    templateUrl: './gestione-serie.component.html',
    styleUrls: ['./gestione-serie.component.scss']
})
export class GestioneSerieComponent implements OnInit, OnDestroy {
    private distruggi$ = new Subject<void>()
    isCollapsed: boolean = true
    errorForm: string = ''
    file: File[] = []
    file_singolo: File | null = null
    img_serie: File | null = null
    video_file: File | null = null
    n_form_episodio: number = 0
    n_form: number = 0 
    n_stagioni: number[] = [] //Array delle stagioni della serie selezionata
    form_scelta: FormGroup
    form_serie: FormGroup
    form_ep: FormGroup
    arr_serie: ISerie[] = []
    arr_serie_ricerca: ISerie[] = []
    arr_generi: IGen[] = []
    arr_episodi: IEpisodio[] = []
    serie$: Observable<I_rispostaserver>
    generi$: Observable<I_rispostaserver>
    serieSelezionata: ISerie | null = null
    episodioSelezionato:IEpisodio | null = null
    idEpisodio: string = ''
    private modalService = inject(NgbModal);
    closeResult: WritableSignal<string> = signal('');
    private ossDelete = { //Osservatore basico per cancellare
        next: () => console.log('cancellato'),
        error: (err: string) => console.log(err),
        complete: () => console.log('completato')
    }


    constructor(private fb: FormBuilder, private api: ApiService, private utility:UtilityService, private oss:OsservatoriService ) {
        this.serie$ = this.api.getSerieTvTotali()
        this.generi$ = this.api.getGenere()
        this.form_scelta = this.fb.nonNullable.group({
            scelta_serie: ''
        })
        this.form_serie = this.fb.nonNullable.group({
            titolo: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(45)] }),
            genere: this.fb.control('', { validators: [Validators.required] }),
            anno_inizio: this.fb.control('', { validators: [Validators.required] }),
            anno_fine: this.fb.control('', { validators: [Validators.required] }),
            voto: this.fb.control('', { validators: [Validators.required] }),
            stagioni: this.fb.control('', { validators: [Validators.required] }),
            trama: this.fb.control('', { validators: [Validators.required, Validators.minLength(20), Validators.maxLength(500)] }),
            img: this.fb.control('', { validators: [Validators.required] }),
        })
        this.form_ep = this.fb.nonNullable.group({
            titolo: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(45)] }),
            voto: this.fb.control('', { validators: [Validators.required] }),
            numero: this.fb.control('', { validators: [Validators.required] }),
            durata: this.fb.control('', { validators: [Validators.required] }),
            stagione: this.fb.control('', { validators: [Validators.required] }),
            trama: this.fb.control('', { validators: [Validators.required, Validators.minLength(20), Validators.maxLength(500)] }),
            video: this.fb.control('', { validators: [Validators.required] }),
            img: this.fb.control('', { validators: [Validators.required] }),
        })
    }
    ngOnInit(): void {
        this.generi$.subscribe(rit => { this.arr_generi = rit.data, console.log(this.arr_generi) })
        this.serie$.subscribe(this.oss.osservatore_serie(this.arr_serie))
    }
    ngOnDestroy(): void {
        this.distruggi$.next()
    }

    /**
     * Funzione per popolare il form con i dati della serie da modificare
     * @return void
     */
    inserimentoSerieDaModificare():void{
        const genere: IGen[] = this.arr_generi.filter(generi => generi.idGenere == this.serieSelezionata?.idGenere)
        console.log(this.serieSelezionata)
        this.form_serie.get('titolo')?.setValue(this.serieSelezionata?.titolo)
        this.form_serie.get('stagioni')?.setValue(this.serieSelezionata?.n_stagioni)
        this.form_serie.get('genere')?.setValue(genere[0].nome)
        this.form_serie.get('anno_inizio')?.setValue(this.serieSelezionata?.anno)
        this.form_serie.get('anno_fine')?.setValue(this.serieSelezionata?.anno_fine)
        this.form_serie.get('voto')?.setValue(this.serieSelezionata?.voto)
        this.form_serie.get('trama')?.setValue(this.serieSelezionata?.trama)
    }

    /**
     * Funzione per controllare i o il file presente nel form
     * @param e Event
     */
    invia(e: Event, form: FormGroup) {
        const element = e.currentTarget as HTMLInputElement
        let filelist: FileList | null = element.files
        if (filelist && filelist != null) {
            console.log('fileList', filelist)
            this.utility.ctrlFileList(filelist, 1, this.errorForm, 5, this.file, form)
        }
    }

    /**
    * Funzione per prendere il file caricato durante la creazione del film
    * @param e Event
    * @return void
    */
    postImg(e: any): void {
        const elem = e.currentTarget.files[0]
        this.file_singolo = elem
        console.log('postimg', this.file_singolo)
    }
    postVideo(e: any): void {
        const elem = e.currentTarget.files[0]
        this.video_file = elem
        console.log('postVideo', this.video_file)
    }


    /**
    * Funzione per settare i valori del form a 0
    * @returen void
    */
    resetSerie():void{
        this.form_serie.get('titolo')?.setValue('')
        this.form_serie.get('stagioni')?.setValue('')
        this.form_serie.get('genere')?.setValue('')
        this.form_serie.get('anno_inizio')?.setValue('')
        this.form_serie.get('anno_fine')?.setValue('')
        this.form_serie.get('voto')?.setValue('')
        this.form_serie.get('trama')?.setValue('')
    }

    /**
     * Funzione per eliminare la serie selezionata
     * @return void
     */
    EliminaOnClickSerie():void{
        const id = this.serieSelezionata!.idSerie.toString()
        this.api.deleteSerie(id).pipe(
            take(1),
            map(x => x),
            takeUntil(this.distruggi$)
        ).subscribe(this.oss.osservatoreGestione('DELETE', this.arr_serie))
        this.serieSelezionata = null
    }
    /**
     * Funzione per aggiungere una serie dopo aver compoletato il form
     * @return void
     */
    AggiungiOnClickSerie():void {
        let fd = new FormData()
        fd.append('titolo', this.form_serie.get('titolo')?.value)
        fd.append('n_stagioni', this.form_serie.get('stagioni')?.value)
        fd.append('idGenere', this.form_serie.get('genere')?.value)
        fd.append('anno', this.form_serie.get('anno_inizio')?.value)
        fd.append('anno_fine', this.form_serie.get('anno_fine')?.value)
        fd.append('durata', this.form_serie.get('durata')?.value)
        fd.append('voto', this.form_serie.get('voto')?.value)
        fd.append('trama', this.form_serie.get('trama')?.value)
        fd.append('path', this.file_singolo!)
        this.api.postSerie(fd).pipe(
            take(1),
            tap(x => console.log('OBS', x)),
            map(x => x.data),
            takeUntil(this.distruggi$)).subscribe(this.oss.osservatoreGestione('POST', this.arr_serie))
    }
    /**
     * 
     * @return void
     */
    ModificaOnClickSerie(): void {
        const id = this.serieSelezionata!.idSerie.toString()//prendo l'id del film
        let obj = {
            titolo: this.form_serie.get('titolo')?.value,
            n_stagioni: this.form_serie.get('stagioni')?.value,
            anno: this.form_serie.get('anno_inizio')?.value,
            anno_fine: this.form_serie.get('anno_fine')?.value,
            idGenere: this.form_serie.get('genere')?.value.idGenere,
            durata: this.form_serie.get('durata')?.value,
            voto: this.form_serie.get('voto')?.value,
            trama: this.form_serie.get('trama')?.value,
        }
        let fd = new FormData()
        fd.append('path', this.file_singolo!)
        if (this.file !== null) {
            this.api.updateLocandinaSerie(fd, id).pipe(
                take(1),
                tap(x => console.log('OBS', x)),
                takeUntil(this.distruggi$)).subscribe(rit => { console.log('path ', rit.data), this.serieSelezionata!.path = rit.data.path, this.utility.creaAlert(true, 'UPDATE') })
        }
        this.api.updateSerie(obj, id).pipe(
            take(1),
            tap(x => console.log('OBS', x)),
            map(x => x.data),
            takeUntil(this.distruggi$)
        ).subscribe(rit => { console.log('path ', rit.data), this.serieSelezionata = rit, this.refresh(), this.utility.creaAlert(true, 'UPDATE') })
    }
    /**
     * 
     */
    refresh() {
        this.arr_serie = []
        this.api.getSerieTvTotali().subscribe(rit => this.arr_serie = rit.data)
    }
    /**
     * Funzione per selezionare il form popolato o il form vuoto 
     * @param string 
     * @return void
    */
    setFormSerie(string: string): void {
        if (string === 'add') {
            this.n_form = 1
        } else if (string === 'mod') {
            this.n_form = 2
        }
    }
    /**
     * Funzione per selezionare il form popolato o il form vuoto 
     * @param string 
     * @return void
    */
    setFormEpisodi(string: string): void {
        if (string === 'add') {
            this.n_form_episodio = 1
        } else if (string === 'mod') {
            this.n_form_episodio = 2
        }
    }

    /**
     * Funzione per fare la sottoscrizione ogni volta che premo il pulsante 
     * episodi
     * @return void
     */
    setEpisodi(): void {
        this.arr_episodi = []
        this.n_stagioni = []
        let episodi$: Observable<I_rispostaserver>//Creo l'observable
        let id = this.serieSelezionata!.idSerie.toString()//Prendo l'id della serie selezionata
        //e la trasformo in una stringa
        episodi$ = this.api.getEpisodiSerie(id)
        episodi$.subscribe(this.oss.osservatoreEpisodi(this.arr_episodi))
        for (let i = 1; i <= this.serieSelezionata!.n_stagioni; i++) {
            this.n_stagioni.push(i)
        }
        console.log('episodi', this.arr_episodi)
    }

    cercaSerie(string: string) {
        this.api.getSeriePerNome(string).subscribe(
            rit => this.arr_serie_ricerca = rit.data
        )
        if (string == '') {
            this.serieSelezionata = null
        }
    }

    caricaStagione(num: number) {

        this.arr_episodi = []
        let id = this.serieSelezionata!.idSerie.toString()//Prendo l'id della serie selezionata
        let episodi$: Observable<I_rispostaserver> = this.api.getEpisodiStagione(id, num) //Creo l'observable                
        episodi$.subscribe(this.oss.osservatoreEpisodi(this.arr_episodi))
        // this.arr_episodi = this.arr_episodi.filter(episodio => episodio .stagione == num )
    }
    setSerie(serie: ISerie) {
        this.serieSelezionata = serie
    }
    
    /**
     * Funzione per iniserire nel form i valori dell'episodio che si vuole modificare
     * @param idEp 
     */
    inserimentoEpisodiDaModificare(idEp: string) {
        let id = this.serieSelezionata!.idSerie.toString()
        let ep$: Observable<I_rispostaserver> = this.api.getEpisodio(id, idEp)
        ep$.subscribe(rit => {
            console.log('ritorno', rit.data)
            this.form_ep.get('titolo')?.setValue(rit.data.titolo)
            this.form_ep.get('voto')?.setValue(rit.data.voto)
            this.form_ep.get('durata')?.setValue(rit.data.durata)
            this.form_ep.get('numero')?.setValue(rit.data.numero)
            this.form_ep.get('stagione')?.setValue(rit.data.stagione)
            this.form_ep.get('trama')?.setValue(rit.data.trama)
            this.idEpisodio = rit.data.idEpisodio.toString()
            console.log("id episodio", this.idEpisodio)
        })

    }

    /**
     * Funzione per elimnare l'episodio scelto
     */
    EliminaOnClickEpisodi() {
        this.api.deleteEpisodio(this.idEpisodio).pipe(
            take(1),
            map(x => x),
            takeUntil(this.distruggi$)
        ).subscribe(this.ossDelete)
    }
    
    /**
     * Funzione per Aggiungere un episodio attraverso la comopilazione del form apposito
    */
    AggiungiOnClickEpisodi() {
        let fd = new FormData()
        fd.append('idSerie', this.serieSelezionata!.idSerie.toString())
        console.log('idSerie', this.serieSelezionata!.idSerie)
        fd.append('titolo', this.form_ep.get('titolo')?.value)
        fd.append('voto', this.form_ep.get('voto')?.value)
        fd.append('durata', this.form_ep.get('durata')?.value)
        fd.append('numero', this.form_ep.get('numero')?.value)
        fd.append('trama', this.form_ep.get('trama')?.value)
        fd.append('stagione', this.form_ep.get('stagione')?.value)
        fd.append('path_img', this.file_singolo!)
        fd.append('path_video', this.video_file!)
        console.log('aggiungo', fd)
        this.api.postEpisodio(fd).subscribe(rit => { this.arr_episodi = rit.data })
    }


    ModificaOnClickEpisodi(id: string) {
        let obj = {
            titolo: this.form_ep.get('titolo')?.value,
            voto: this.form_ep.get('voto')?.value,
            durata: this.form_ep.get('durata')?.value,
            numero: this.form_ep.get('numero')?.value,
            trama: this.form_ep.get('trama')?.value,
            stagione: this.form_ep.get('stagione')?.value
        }
        let fd = new FormData()

        if (this.file_singolo !== null) {
            fd.append('path_img',this.file_singolo!)
            this.api.updateLocandinaEpisodio(fd, id).pipe(
                take(1),
                tap(x => console.log('OBS', x)),
                takeUntil(this.distruggi$)).subscribe(rit => { console.log('path_img', rit.data) })
        }
        let fd_video = new FormData()
        if(this.video_file !== null){
            fd_video.append('path_video',this.file_singolo!)
            this.api.updateVideoEpisodio(fd_video,id).pipe(
                take(1),
                tap(x => console.log('OBS POST VIDEO', x)),
                takeUntil(this.distruggi$)).subscribe()
        }
        this.api.updateEpisodio(obj, this.idEpisodio).subscribe()
        this.setEpisodi()
    }

    resetEpisodio() {
        this.form_ep.get('titolo')?.setValue('')
        this.form_ep.get('voto')?.setValue('')
        this.form_ep.get('durata')?.setValue('')
        this.form_ep.get('numero')?.setValue('')
        this.form_ep.get('stagione')?.setValue('')
        this.form_ep.get('trama')?.setValue('')
    }



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
