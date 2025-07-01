import { Component, inject, Input, OnInit, TemplateRef } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { OsservatoriService } from 'src/app/_servizi/osservatori.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { IEpisodio } from 'src/app/interfaces/IEpisodi.interface';
import { IFilm } from 'src/app/interfaces/IFilm.interface';
import { ISerie } from 'src/app/interfaces/ISerie.interface';

@Component({
    selector: 'nav-tab',
    templateUrl: './nav-tab.component.html',
    styleUrls: ['./nav-tab.component.scss']
})
export class NavTabComponent implements OnInit {
    closeResult = ''
    private modalService = inject(NgbModal);
    formato: string = '.jpg' //formato delle immagini
    cartella_img: string = '../../../assets/film_cover/' //Percorso della cartella contenente le immagini di film e serie
    @Input('elementi_film') elementi_film!: IFilm[] //Array con i film per lo slider
    @Input('elementi_serie') elementi_serie!: ISerie[] //Array contenenti le serie per lo slider
    @Input('episodi') episodi!: IEpisodio[] //Array con gli episodi della serie
    @Input('film') film!: IFilm //Film selezionato 
    @Input('serie') serie!: ISerie //Serie selezionata
    @Input('generi2') generi2!: string //Generi secondari
    @Input('FilmOSerie') FIlmOSerie!:boolean //True o false per saper se la risorsa è un film o una serie (Vero = film, falso = serie) 
    arr_generi_secondari: string[] = [] //Array contenenti i generi secondari
    @Input('n_stagioni') n_stagioni: number[] = [] //Array delle stagioni della serie selezionata
    
    constructor(private api:ApiService, private oss:OsservatoriService) {
        
    }
    ngOnInit(): void {

    }

    /**
     * Funzione per selezionare gli episodi di una determinata stagione
     * @param n 
     * @returns 
     */
    select_stagioni(n:any):Subscription{
        var num = n.target.value
        this.episodi = []
        return this.api.getEpisodiStagione(this.serie.idSerie.toString(),num).subscribe(this.oss.osservatoreEpisodi(this.episodi))
    }

    attivo: number = 1
    setActive(button: HTMLButtonElement) {
        if (button.id === 'content-tab') {
            this.attivo = 2
        } else if (button.id === 'episodi-tab') {
            this.attivo = 1
        } else if (button.id === 'details-tab') {
            this.attivo = 3
        }
    }
    setActiveDue(button: HTMLButtonElement) {
        if (button.id === 'content-tab') {
            this.attivo = 1
        }else if (button.id === 'details-tab') {
            this.attivo = 2
        }
    }

    setVideo(string:string){
        let video = document.getElementById('video_ep') as HTMLVideoElement
        console.log('video', video)
        video.src = string
        video.style.width = '100%'
        video.style.height = 'auto'
        video.requestFullscreen()
    }




    /**
     * Funzione per aprire la modal con i video degli episodi o del film
     * @param content 
     */ 
    open(content: TemplateRef<any>) {
        this.modalService.open(content, { fullscreen: true }).result.then(
            (result: any) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason: any) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            },
        );
    }

    /**
     * Funzione per chiudere la modal con il video
     * @param reason 
     * @returns string
     */
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }




}
