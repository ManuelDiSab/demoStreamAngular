import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { IEpisodio } from 'src/app/interfaces/IEpisodi.interface';
import { I_rispostaserver } from 'src/app/interfaces/IRirspostaServer.interface';

@Component({
    selector: 'app-gestione-episodi',
    templateUrl: './gestione-episodi.component.html',
    styleUrls: ['./gestione-episodi.component.scss']
})
export class GestioneEpisodiComponent implements OnInit, OnDestroy {
    private distruggi$ = new Subject<void>()
    video_file: File | null = null
    img_file: File | null = null
    form_ep: FormGroup
    n_form_episodio: number = 0
    arr_episodi: IEpisodio[] = []
    idEpisodio: string = ''
    private modalService = inject(NgbModal);
    closeResult: WritableSignal<string> = signal('');
    constructor(private utility: UtilityService, private api: ApiService, private fb: FormBuilder) {
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

    }
    ngOnDestroy(): void {
        this.distruggi$.next()
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
    * Funzione per prendere il file caricato durante la creazione del film
    * @param e Event
    * @return void
    */
    postImg(e: any): void {
        const elem = e.currentTarget.files[0]
        this.img_file = elem
    }
    postVideo(e: any): void {
        const elem = e.currentTarget.files[0]
        this.video_file = elem
    }
}
