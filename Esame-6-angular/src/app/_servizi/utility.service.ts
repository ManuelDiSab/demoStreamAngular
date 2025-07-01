import { Injectable } from '@angular/core';
import CodiceFiscale from 'codice-fiscale-js';
import { sha512 } from 'js-sha512';
import { jwtDecode } from 'jwt-decode';
import { Gender } from '../types/Gender.types';
import { I_rispostaserver } from '../interfaces/IRirspostaServer.interface';
import { IFilm } from '../interfaces/IFilm.interface';
import { ISerie } from '../interfaces/ISerie.interface';
import { IEpisodio } from '../interfaces/IEpisodi.interface';
import { FormGroup } from '@angular/forms';
import { IGen } from '../interfaces/IGenere.interface';
import { Observer } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor(private api: ApiService) { }
    /**
   * Funzione che legge i dati dal token 
   * 
   * @param token stringa che rappresenta il token  
   * @returns un oggetto
   */
    static LeggiToken(token: string): any {
        try {
            return jwtDecode(token)
        } catch (error) {
            console.error('Errore di lettura nel token', error)
            return null
        }
    }

    /**
  * Funzione per calcolare l'hash con algoritmo SHA512 unendo password e sale
  * 
  * @param password stringa che rappresenta la password
  * @param sale stringa che rappresenta un'altra stringa da legare alla password
  * @returns string rappresenta l'hash con SHA512 della password unita al sale 
  */
    static nascondiPassword(password: string, sale: string): string {
        const tmp: string = sale + password;  // unisco le due stringhe
        const hash: string = sha512(tmp); // faccio l'hash e poi lo ritorno  
        return hash;
    }

    /**
 * Funzione che crea un hash con algoritmo SHA512 della srtinga che viene passata
 * @param str stringa da cifrare
 * @returns stringa cifrata con lo SHA512
 */
    static hash(str: string): string {
        const stringaCifrata: string = sha512(str)
        return stringaCifrata
    }

    /**
     * Funzione per calcolar il codice fiscale utilizzando la classe CodiceFiscale importata da npmjs.com (npm i codice-fiscale-js)
     * @param nome nome della persona
     * @param cognome cognome della persona 
     * @param comune comune di nascita
     * @param data data di nascita 
     * @param sesso maschio o femmina
     * @returns string codice fiscale 
     */
    public CodFis(nome: string, cognome: string, comune: string, data: string, sesso: Gender, provincia: string): string {
        const newdata = new Date(data)
        const giorno = newdata.getDate() //prendo il giorno dalla data
        const mese = newdata.getMonth() + 1 //prendo il mese dalla data e aggiungo 1 per avere il numero del mese esatto
        const anno = newdata.getFullYear() //prendo l'anno dalla data
        const cf = CodiceFiscale.compute({ //Uso il metodo compute della classe Codice Fiscale per calcolare il codice 
            name: nome,
            surname: cognome,
            gender: sesso,
            day: giorno,
            month: mese,
            year: anno,
            birthplace: comune,
            birthplaceProvincia: provincia
        });
        console.log('dati:', nome, cognome, sesso, giorno, mese, anno, comune, provincia)
        return cf
    }

    ctrlFileList(filelist: FileList, maxFileN: number, errore: string, maxSizeMb: number, arr: File[], form: FormGroup): void {

        if (filelist !== null) {
            if (filelist.length > maxFileN) {
                errore = 'Numero di file massimo superato! Puoi caricare un massimo di ' + maxFileN + ' file'
            } else {
                for (let i = 0; i < filelist.length; i++) {
                    if (!this.ControlExt(filelist[i].name, 'webp')) {
                        errore = filelist[i].name + " non ha l'estensione corretta"
                        console.log('file: ', filelist[i].name)
                        break
                    } else if (!this.ControlSize(filelist[i].size, maxSizeMb)) {
                        errore = filelist[i].name + " è troppo grande! La dimensione massima accettata è di " + maxSizeMb + " Mb!"
                        break
                    } else if (!this.ControlInArray(filelist[i])) {
                        arr.push(filelist[i])
                    }
                }
                console.log('File inseriti', arr)
                form.get('img')?.setValue(filelist, { emitModelToViewChange: false })
            }
        }
    }
    ControlInArray(file: File): boolean {
        return false
    }
    /**
     * Funzione per controllare l'estensione della locandina
     * @param nome 
     * @param ext 
     * @returns boolean
     */
    ControlExt(nome: string, ext: string): boolean {
        const tmp = nome.split('.')
        return (tmp[tmp.length - 1] !== ext) ? false : true
    }

    /**
     * Funzione per il controllo della dimensione del file
     * @param size 
     * @param maxSizeMb 
     * @returns 
     */
    ControlSize(size: number, maxSizeMb: number): boolean {// Controllo della dimensione del file
        const tmp = maxSizeMb * 1024 * 1024
        return (size > tmp) ? false : true
    }

    /**
     * Funzione per creare un array contente tutti i numeri tra il primo e il secondi numero passato alla funzione
     * @param inizio numero da cui iniziare
     * @param fine numero finale
     * @returns array<number>
     */
    public creaRange(inizio:number, fine:number):Array<number>{
        let array:number[] = []
        for(let i = inizio; i <= fine; i++){
            array.push(i)
        }
        return array
    }

    /**
    * Funzione per creare un alert che notificherà il successo o meno del post del film
    * @param bool valore booleano per determinare il colore dell'alert 
    * @param azione stringa per determinare il testo dell'alert 
    * @return void
    **/
    creaAlert(bool: boolean, azione: 'POST' |'DELETE' | 'UPDATE'): void {
        let button = document.createElement('button')
        let elem = document.getElementById('alert')
        let div = document.createElement('div')
        div.role = 'alert'
        button.className = 'btn-close'
        button.setAttribute('data-bs-dismiss', 'alert')
        if (bool === true) {
            switch (azione) {
                case 'POST': div.innerHTML = "Nuova risorsa creata con successo"
                    break;
                case 'DELETE': div.innerHTML = "Eliminazione avvenuta con successo"
                    break;
                case 'UPDATE': div.innerHTML = 'Modifica avvenuta con successo'
                    break
            }
            div.className = 'alert alert-success alert-dismissible fade show'
            div.appendChild(button)
            elem!.appendChild(div)
        } else {
            switch (azione) {
                case 'POST': div.innerHTML = "Ops! Errore nel post della risorsa"
                    break;
                case 'DELETE': div.innerHTML = "Ops! Errore nell'eliminazione"
                    break;
                case 'UPDATE': div.innerHTML = 'Ops! Errore nella modifica'
                    break
            }
            div.className = 'alert alert-danger alert-dismissible fade show'
            div.appendChild(button)
            elem!.appendChild(div)
        }
    }

    /**
     * Funzione per agginugere ai preferiti una serie o un film
     * @param item IFilm o ISerie
     * @returns void
     */
    AddPreferiti(item: IFilm | ISerie):void{
        if (item.film) {
            this.api.addFilmPrefe(item.idFilm).subscribe()
        } else {
            this.api.addSeriePrefe(item.idSerie).subscribe()
        }
        
    }


    /**
     * Funzione per togliere un film o una serie dai preferiti
     * @param item IFilm o ISerie
     * @returns void
     */
    TogliDaiPreferiti(item: ISerie | IFilm):void{
        if (item.film) {
            this.api.delFilmPrefe(item.idFilm).subscribe()
        } else {
            this.api.delSeriePrefe(item.idSerie).subscribe()
        }
    }
    
}

