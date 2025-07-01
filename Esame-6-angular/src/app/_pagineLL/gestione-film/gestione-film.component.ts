import { Component, inject, Input, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { IGen } from 'src/app/interfaces/IGenere.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';


@Component({
    selector: 'app-gestione-film',
    templateUrl: './gestione-film.component.html',
    styleUrls: ['./gestione-film.component.scss']
})
export class GestioneFilmComponent implements OnInit {

    private distruggi$ = new Subject<void>()
    errorForm: string = ''
    n_form: number = 0
    file: File[] = []
    file_post: File | null = null
    video_file: File | null = null
    form_select: FormGroup
    form_film: FormGroup
    arr_film_tab: IFilm[] = []
    arr_film: IFilm[] = []
    ricerca: string = ''
    film$: Observable<I_rispostaserver>
    filmSelezionato: IFilm | null = null
    generi$: Observable<I_rispostaserver>
    arr_generi: IGen[] = []
    private modalService = inject(NgbModal);
    closeResult: WritableSignal<string> = signal('');

    constructor(private api: ApiService, private utility: UtilityService, private oss: OsservatoriService, private fb: FormBuilder,
         public activeModal: NgbActiveModal) {
        this.film$ = this.api.getFilmTotali()
        this.generi$ = this.api.getGenere()
        this.form_select = this.fb.nonNullable.group({
            select_film: '',
        })
        this.form_film = this.fb.nonNullable.group({
            titolo: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(45)] }),
            regista: this.fb.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(45)] }),
            video: this.fb.control('', { validators: [Validators.required] }),
            genere: this.fb.control('', { validators: [Validators.required] }),
            generi2: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
            anno: this.fb.control('', { validators: [Validators.required] }),
            voto: this.fb.control('', { validators: [Validators.required] }),
            durata: this.fb.control('', { validators: [Validators.required] }),
            trama: this.fb.control('', { validators: [Validators.required, Validators.minLength(20), Validators.maxLength(500)] }),
            img: this.fb.control('', { validators: [Validators.required] }),
        })
    }
    ngOnInit(): void {
        this.generi$.subscribe(rit => { this.arr_generi = rit.data, console.log })
        this.film$.subscribe(this.oss.osservatoreFilm(this.arr_film_tab))
    }
    ngOnDestroy(): void {
        this.distruggi$.next()
    }

    cercaFilm(string: string) {
        this.api.getFilmPerNome(string).subscribe(
            rit => this.arr_film = rit.data
        )
        if (string == '') {
            this.filmSelezionato = null
        }
    }

    /**
     * Funzione per selezionare il form popolato o il form vuoto 
     * @param string 
     */
    setForm(string: string) {
        if (string === 'add') {
            this.n_form = 1
        } else if (string === 'mod') {
            this.n_form = 2
        }
    }

    /**
     * Funzione per popolare il form al click del primo tasto modfica 
     * 
     */
    inserimnetoFilmDaModificare() {
        const genere: IGen[] = this.arr_generi.filter(generi => generi.idGenere == this.filmSelezionato?.idGenere)
        this.form_film.get('titolo')?.setValue(this.filmSelezionato?.titolo)
        this.form_film.get('regista')?.setValue(this.filmSelezionato?.regista)
        this.form_film.get('genere')?.setValue(genere[0].idGenere)
        this.form_film.get('generi2')?.setValue(this.filmSelezionato?.generi_secondari)
        this.form_film.get('anno')?.setValue(this.filmSelezionato?.anno)
        this.form_film.get('voto')?.setValue(this.filmSelezionato?.voto)
        this.form_film.get('durata')?.setValue(this.filmSelezionato?.durata)
        this.form_film.get('trama')?.setValue(this.filmSelezionato?.trama)
        this.form_film.get('path_img')?.setValue(this.filmSelezionato?.path)
        this.form_film.get('video')?.setValue(this.filmSelezionato?.video)
    }

    setFilm(Film: IFilm) {
        this.filmSelezionato = Film
    }

    /**
     * Funzione per effettuare la modifica al click
     * @return void
     */
    modificaOnClick(): void {
        const id = this.filmSelezionato!.idFilm.toString()//prendo l'id del film
        let obj = {
            titolo: this.form_film.get('titolo')?.value,
            regista: this.form_film.get('regista')?.value,
            anno: this.form_film.get('anno')?.value,
            voto: this.form_film.get('voto')?.value,
            durata: this.form_film.get('durata')?.value,
            idGenere: this.form_film.get('genere')?.value,
            generi_secondari: this.form_film.get('generi2')?.value,
            trama: this.form_film.get('trama')?.value,
        }
        let fd = new FormData()
        if (this.file_post !== null) {
            fd.append('path_img', this.file_post)
            this.api.updateLocandinaFIlm(fd, id).pipe(
                take(1),
                tap(x => console.log('OBS', x)),
                takeUntil(this.distruggi$)).subscribe(rit => { console.log('path ', rit.data), this.filmSelezionato!.path = rit.data.path, this.utility.creaAlert(true, 'UPDATE') })
        }
        let fd_video = new FormData()
        if(this.video_file !== null){
            fd_video.append('path_video', this.video_file)
            this.api.updateVideoFIlm(fd_video, id).pipe(
                take(1),
                tap(x => console.log('OBS', x)),
                takeUntil(this.distruggi$)).subscribe(rit => { console.log('path ', rit.data), this.filmSelezionato!.video = rit.data.path_video, this.utility.creaAlert(true, 'UPDATE') })
        }

        this.api.updateFilm(obj, id).pipe(
            take(1),
            tap(x => console.log('OBS', x)),
            map(x => x.data),
            takeUntil(this.distruggi$)).subscribe(this.osservatore())
    }

    /**
     * Funzione per effettuare un refresh delle risorse
     * @return void
     */
    refresh(): void {
        this.arr_film_tab = []
        this.api.getFilmTotali().subscribe(rit => this.arr_film_tab = rit.data)
    }

    /**
     * Funzione per aggiungere un nuovo film al click
     * @return void
     */
    AggiungiOnClick(): void {
        let fd = new FormData()
        if (this.form_film.valid) {
            fd.append('titolo', this.form_film.get('titolo')?.value)
            fd.append('regista', this.form_film.get('regista')?.value)
            fd.append('anno', this.form_film.get('anno')?.value)
            fd.append('voto', this.form_film.get('voto')?.value)
            fd.append('durata', this.form_film.get('durata')?.value)
            fd.append('idGenere', this.form_film.get('genere')?.value)
            fd.append('generi_secondari', this.form_film.get('generi2')?.value)
            fd.append('trama', this.form_film.get('trama')?.value)
            fd.append('path_img', this.file_post!)
            fd.append('path_video', this.video_file!)
        }
        this.api.postFilm(fd).pipe(
            take(1),
            takeUntil(this.distruggi$)).subscribe(this.oss.osservatoreGestione('POST', this.arr_film))
    }

    /**
     * Funzione per controllare i o il file presente nel form
     * @param e Event
     */
    invia(e: Event) {
        const element = e.currentTarget as HTMLInputElement
        let filelist: FileList | null = element.files

        if (filelist && filelist != null) {
            console.log('fileListDainiiput', filelist)
            this.utility.ctrlFileList(filelist, 1, this.errorForm, 5, this.file, this.form_film)
        }
    }
    /**
     * Funzione per prendere il file caricato durante la creazione del film
     * @param e Event
     * @return void
     */
    postImg(e: any): void {
        const elem = e.currentTarget.files[0]
        this.file_post = elem
    }
    postVideo(e: any): void {
        const elem = e.currentTarget.files[0]
        this.video_file = elem
        console.log('video', this.video_file)
    }
    /**
     * Funzione per eliminare il film selezionato al click del pulsante di conferma
     */
    EliminaOnClick() {
        const id = this.filmSelezionato!.idFilm.toString()
        this.api.deleteFilm(id).pipe(
            take(1),
            map(x => x),
            takeUntil(this.distruggi$)
        ).subscribe(this.oss.osservatoreGestione('DELETE', null))
        this.filmSelezionato = null
    }

    /**
     * Funzione per spopolare il form 
     */
    reset() {
        this.form_film.get('titolo')?.setValue('')
        this.form_film.get('regista')?.setValue('')
        this.form_film.get('genere')?.setValue('')
        this.form_film.get('generi2')?.setValue('')
        this.form_film.get('anno')?.setValue('')
        this.form_film.get('voto')?.setValue('')
        this.form_film.get('durata')?.setValue('')
        this.form_film.get('trama')?.setValue('')
    }


    public osservatore() {
        return {
            next: (rit: IFilm) => { this.filmSelezionato = rit },
            error: (err: string) => { console.log(err), this.utility.creaAlert(false, 'UPDATE') },
            complete: () => { this.utility.creaAlert(true, 'UPDATE') }
        }
    }


    //Funzioni per le modal
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

