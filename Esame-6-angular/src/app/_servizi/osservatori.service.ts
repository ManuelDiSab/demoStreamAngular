import { Injectable } from '@angular/core';
import { I_rispostaserver } from '../interfaces/IRirspostaServer.interface';
import { IIndirizzo } from '../interfaces/IIndirizzo.interface';
import { INazione } from '../interfaces/INazione.interface';
import { ISerie } from '../interfaces/ISerie.interface';
import { IFilm } from '../interfaces/IFilm.interface';
import { IEpisodio } from '../interfaces/IEpisodi.interface';
import { UtilityService } from './utility.service';
import { IGen } from '../interfaces/IGenere.interface';

@Injectable({
    providedIn: 'root'
})
export class OsservatoriService {

    constructor(private utility:UtilityService) {

    }


    

    // Osservatore per le chiamate POST e DELETE  
    public osservatoreGestione(string: 'POST' | 'DELETE', arr: ISerie[] | IFilm[] | IEpisodio[] | null) {
        return { //Osservatore basico per cancellare
            next: (rit: I_rispostaserver) => { arr = rit.data },
            error: (err: string) => { console.log(err), this.utility.creaAlert(false, string) },
            complete: () => { this.utility.creaAlert(true, string) }
        }
    }


    //Osservaore per gli update
    public osservatoreGestUpdate(risorsa: IFilm | IEpisodio | ISerie | IGen) {
        return {
            next: (rit: IFilm | IEpisodio | ISerie | IGen) => { risorsa = rit },
            error: (err: string) => { console.log(err), this.utility.creaAlert(false, 'UPDATE') },
            complete: () => { this.utility.         creaAlert(true, 'UPDATE') }
        }
    }



    /**
     * Osservatore per le province
     * @param province [string] 
     */
    osservatoreSigla(province: string[]) {
        return {
            next: (rit: I_rispostaserver) => {
                const elem = rit.data
                const tmp: string[] = []
                for (let i = 0; i < elem.length; i++) {
                    tmp.push(elem[i].siglaAuto)
                }
                province = tmp
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
    public osservatoreNazioni(arr_nazioni: INazione[]) {
        return {
            next: (rit: I_rispostaserver) => {
                const elem = rit.data
                for (let i = 0; i < elem.length; i++) {
                    const tmp: INazione = {
                        idNazione: elem[i].idNazione,
                        nome: elem[i].nome,
                        prefisso: elem[i].PrefissoTelefonico
                    }
                    arr_nazioni.push(tmp)
                }
            }, error: (err: any) => {
                console.log('error:', err)
            }, complete: () => {
                console.log('completato')
            }
        }
    }

    public osservatoreFilm(arr:( IFilm|ISerie)[]) {
        return {
            next: (rit: I_rispostaserver) => {
                const elem = rit.data
                for (let i = 0; i < elem.length; i++) {
                    const movie: IFilm = {
                        idFilm: elem[i].idFilm,
                        titolo: elem[i].titolo,
                        genere: elem[i].genere,
                        idGenere: elem[i].idGenere,
                        generi_secondari: elem[i].generi_secondari,
                        trama: elem[i].trama,
                        anno: elem[i].anno,
                        durata: elem[i].durata,
                        regista: elem[i].regista,
                        path: elem[i].path,
                        video:elem[i].path,
                        voto: elem[i].voto,
                        film: true,
                        preferito: elem[i].preferito
                    }
                    arr.push(movie)
                }
            },
            error: (err: any) => {
                console.log('error:', err)
            },
            complete: () => {
                console.log('completato')
            }
        }
    }//Fine osservatore film


    public osservatore_serie(arr:(ISerie | IFilm)[]) {
        return {
            next: (rit: I_rispostaserver) => {
                const elem = rit.data

                for (let i = 0; i < elem.length; i++) {
                    const serieTV: ISerie = {
                        idSerie: elem[i].idSerie,
                        voto: elem[i].voto,
                        titolo: elem[i].titolo,
                        genere: elem[i].genere,
                        idGenere: elem[i].idGenere,
                        trama: elem[i].trama,
                        anno: elem[i].anno,
                        anno_fine: elem[i].anno_fine,
                        n_stagioni: elem[i].n_stagioni,
                        path: elem[i].path,
                        film: false,
                        preferito: elem[i].preferito
                    }
                    arr.push(serieTV)
                }
            },
            error: (err: any) => {
                console.log('error:', err)
            },
            complete: () => {
                console.log('completato')
            }
        }
    }//Fine


    public osservatoreEpisodi(arr: IEpisodio[]) {
        return {
            next: (rit: I_rispostaserver) => {
                const elem = rit.data

                for (let i = 0; i < elem.length; i++) {
                    const episodio: IEpisodio = {
                        idEpisodio: elem[i].idEpisodio,
                        idSerie: elem[i].idSerie,
                        titolo: elem[i].titolo,
                        voto: elem[i].voto,
                        numero: elem[i].numero,
                        trama: elem[i].trama,
                        stagione: elem[i].stagione,
                        durata: elem[i].durata,
                        path_img: elem[i].path_img,
                        path_video: elem[i].path_video

                    }
                    arr.push(episodio)
                }
            },
            error: (err: any) => {
                console.log('error:', err)
            },
            complete: () => {
                console.log('completato episodio')
            }
        }
    }//Fine

}
