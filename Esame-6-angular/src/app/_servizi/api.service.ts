import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { chiamateHttp } from '../types/chiamateHttp.type';
import { BehaviorSubject, concatMap, map, Observable, take, tap } from 'rxjs';
import { I_rispostaserver } from '../interfaces/IRirspostaServer.interface';
import { UtilityService } from './utility.service';
import { IFilm } from '../interfaces/IFilm.interface';
import { ISerie } from '../interfaces/ISerie.interface';
import { Comune } from 'codice-fiscale-js/types/comune';
import { IRegistrazione } from '../interfaces/IRegistrazione.interface';
import { IUser } from '../interfaces/IUser.interface';
import { AuthService } from './auth.service';
import { computeStyles } from '@popperjs/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) {

    }

    // ##########  API SERVICE PER ADMIN E UTENTI  #########################################################
    /**
      *
      * @param risorsa(string|number)[]
      *
      *
      *
      * @returns string stringa che rappresenta endpoint del server
      */
    protected CalcolaRisorsa(risorsa: (string | number)[]): string {
        const server: string = '/api'
        const versione: string = 'v1'
        let url = server + '/' + versione + '/'
        // risorsa.forEach(x => { url = url + x + '/' })
        url = url + risorsa.join("/") // il join prende l'array() e separa gli elementi con quello che gli viene pas sato
        return url
    }


    /**
     *
     * @param risorsa (string|number)[] risorsa di cui voglio sapere i dati
     * @param tipo string GET | PUT | POST | DELETE tipo di chiamata Http
     * @param parametri Object | null parametri da pasare all'endpoint
     * @returns Observable
     */
    protected richiestaGenerica(risorsa: (string | number)[], tipo: chiamateHttp, parametri: Object | null = null): Observable<I_rispostaserver> {

        const url = this.CalcolaRisorsa(risorsa)

        switch (tipo) {
            case 'GET': console.log('metodo GET', url)
                return this.http.get<I_rispostaserver>(url)
                break;

            case 'POST': console.log('metodo POST')
                if (parametri !== null) {
                    return this.http.post<I_rispostaserver>(url, parametri).pipe(
                        tap(x => console.log("Service", x))
                    )
                } else {
                    const objErrore = { data: null, message: null, error: 'NO_PARAMETRI' }
                    const observable$ = new Observable<I_rispostaserver>(Subscriber => Subscriber.next(objErrore))
                    return observable$
                }
                break;


            case 'PUT': console.log('metodo PUT')
                if (parametri !== null) {
                    return this.http.put<I_rispostaserver>(url, parametri).pipe(
                        tap(x => console.log("Service", x))
                    )
                } else {
                    const objErrore = { data: null, message: null, error: 'NO_PARAMETRI' }
                    const observable$ = new Observable<I_rispostaserver>(Subscriber => Subscriber.next(objErrore))
                    return observable$
                }
                break;

            case 'DELETE': console.log('metodo DELETE')
                return this.http.delete<I_rispostaserver>(url)
                break



            default: console.log('default ')
                return this.http.get<I_rispostaserver>(url)
                break
        }
    }


    // ###############   FUNZIONI PER L'ACCESSO E LA REGISTRAZIONE DELL'UTENTE  ##################################################
    /**
         * Funzione che invia l'hash utente al server per l'autenticazione
         * @param hashUtente stringa che rappresenta l'hash utente
         * @returns Ritorna un Observable
         */
    public getLoginFase1(hashUtente: string): Observable<I_rispostaserver> {
        console.log('inizio login fase1')
        const risorsa: string[] = ['accedi', hashUtente]
        //  console.log('hash utente:',hashUtente)
        const rit = this.richiestaGenerica(risorsa, 'GET')
        console.log('fine login fase 1')
        return rit
    }

    /**
    * Funzione che manda utente e password cifrati al server
    * @param hashUtente stringa che rappresenta l'hash utente
    * @param hashPassword stringa che rappresenta l'hash SHA512 della password unita al sale
    * @returns Ritorna un Observable
    */
    public getLoginFase2(hashUtente: string, hashPassword: string): Observable<I_rispostaserver> {
        console.log('inizio login fase 2')
        const risorsa: string[] = ['accedi', hashUtente, hashPassword]
        const rit = this.richiestaGenerica(risorsa, 'GET')
        console.log('fine login fase 2')
        return rit
    }

    /**
    * Funzione che effettua il login 
    * @param password stringa che rappresenta una password
    * @param utente stringa che rappresenta l'utente
    * @returns Ritorna un observable
    */
    public login(password: string, utente: string): Observable<I_rispostaserver> {
        const hashUtente: string = UtilityService.hash(utente) //Faccio l'hash dello user
        const hashPassword: string = UtilityService.hash(password) //Faccio l'hash della password
        const controllo$ = this.getLoginFase1(hashUtente).pipe(
            take(1),
            tap(x => console.log('dati: ', x)),
            map((rit: I_rispostaserver): string => {
                const salt: string = rit.data.salt //prendo il salt 
                const passwordNascosta = UtilityService.nascondiPassword(hashPassword, salt) //Creo un nuovo hash unendo la password hashata con il salt
                return passwordNascosta //ritono il nuovo hash
            }),
            concatMap((rit: string) => {
                return this.getLoginFase2(hashUtente, rit)
            })
        )
        return controllo$
    }
    /**
     * Funzione per effettuare la registrazione sulla piattaforma
     * @dati Object 
     */
    public register(dati: FormData): Observable<I_rispostaserver> {
        const risorsa: string[] = ['register']
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * Funzione per controllare se l'utente è collegato ed esiste
     * e torno il sale
     */
    public CheckUtenteCambioPassword(){
        const risorsa:string[] = ['user/check-utente']
        return this.richiestaGenerica(risorsa, 'GET')
    }
    

    /**
     * Funzione per cambiare la password
     * @param dati FormData con la password
     * @returns Observable
    */
    public cambiaPasswordInizio(hash:string, dati:FormData):Observable<I_rispostaserver>{
        const risorsa:string[] = ['user/cambia-password',hash]
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    public cambioPasswordFinale(password:string, newPassword:FormData){
        const hashPsw = UtilityService.hash(password)
        const $obs = this.CheckUtenteCambioPassword().pipe(
            take(1),
            tap(x => console.log('dati cambio', x)),
            map((rit:I_rispostaserver) => {
                const salt = rit.data
                const pswNascosta = UtilityService.nascondiPassword(hashPsw, salt)
                return pswNascosta
            }),
            concatMap((rit) => {
                console.log('lu rit', rit)
                return this.cambiaPasswordInizio(rit,newPassword)
            })
        )
        return $obs
    }

    /**
     * Funzione per ritornare i dati dell'utente loggato utilizzando l'endpoint delle api REST create appositamente
     * 
     * @returns Observable
     */
    public getUserProfile(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['user']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per modificare il proprio profilo utente
     * @returns Observable  
     */
    public modicaUserProfile(dati: object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['user']
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }
    /**
     * Funzione per eliminare il proprio profilo utente
     * @returns Observable
     */
    public deleteUserProfile(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['user']
        return this.richiestaGenerica(risorsa, 'DELETE')
    }

    /**
     * Funzione per ritornare i dati anagrafici dell'utente loggato utilizzando l'endpoint delle api REST create appositamente
     * @returns Observable
     */
    public ModificaUserAnagrafica(dati: object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['dati-utente']
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }
    /**
     * Funzione per ritornare i dati dell'utente loggato utilizzando l'endpoint delle api REST create appositamente
     * @returns Observable
    */
    public getUserAnagrafica(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['dati-utente']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per ritornare gli indirizzi dell'utente
     * @returns observable
     */
    public getUserIndirizzo(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['indirizzo-user']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    public getUserRecapiti(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['recapiti-utente']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per modificare i recapiti dell'utente
     * @param dati Dati per la modifica
     * @param id id dello user
     * @returns observable
     */
    public updateUserRecapiti(dati: object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['recapiti']
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }

    /**
     * Funzione le tipologie degli indirizzi
     * @returns Observable
    */
    public getTipoIndirizzo(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['Tipo-inidirizzo']
        return this.richiestaGenerica(risorsa, 'GET')
    }
    /**
     * Funzione che ritorna l'indirizzo dell'utente loggato
     * @returns Observable
    */
    public getIndirizzo(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['indirizzo']
        return this.richiestaGenerica(risorsa, 'GET')
    }
    /**
     * Funzione le tipologie degli indirizzi
     * @returns Observable
    */
    public modificaIndirizzo(dati: Object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['indirizzo']
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }

    /**
     * Funzione le tipologie degli indirizzi
     * @returns Observable
    */
    public getIndirizzoSpecifico(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['Tipo-inidirizzo', id]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione che ritorna la collection dei comuni ITALIANI
     * @returns oBSERVABLE
    */
    public getComuni(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['comuni']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    public getComuneByNome(nome: string): Observable<I_rispostaserver> {
        const risorsa: string[] = [`comuni?nome=${nome}`]
        return this.richiestaGenerica(risorsa, 'GET')
    }
    /**
    * Funzione che ritorna la collection dei comuni ITALIANI
    * @returns oBSERVABLE
    */
    public getProvince(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['sigla-provincia']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    public getProvinciaByComune(comune: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['provincia', comune]
        return this.richiestaGenerica(risorsa, 'GET')
    }
    /**
    * Funzione che ritorna la collection dei comuni ITALIANI
    * @returns oBSERVABLE
    */
    public getNazioni(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['nazioni']
        return this.richiestaGenerica(risorsa, 'GET')
    }

        /**
    * Funzione che ritorna la collection dei comuni ITALIANI
    * @returns oBSERVABLE
    */
    public getNazioniByNome(nome:string): Observable<I_rispostaserver> {
        const risorsa: string[] = [`nazioni?nome=${nome}`]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
    * Funzione che ritorna la collection dei comuni ITALIANI
    * @returns oBSERVABLE
    */
    public getNazioneById(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['nazioni', id]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione che ritorna la collection dei generi cinematografici
     * @returns oBSERVABLE
    */
    public getGenere(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['genere']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
    * Funzione che ritorna il genere corrispondente all'id passato
    * @returns oBSERVABLE
    */
    public getGenereById(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['genere', id]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per ritornare i film attraverso le api 
     * @returns Observable
    */
    public getFilmTotali(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['film']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per ricercare un film specifico attraverso il titolo 
     * usando una query string
     * @param val nome del film da cercare 
     * @returns Observable
     */
    public getFilmPerNome(val: string): Observable<I_rispostaserver> {
        const risorsa: string[] = [`film/search?titolo=${val}`]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
      * Funzione per ricercare un film specifico
      * @param id id del film da cercare 
      * @returns Observable
      */
    public getFilmPerId(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['film', id]
        return this.richiestaGenerica(risorsa, 'GET')
    }


    /**
     * Funzione per ricerca i film appartenenti al genere passato
     * @param idGenere ID del genere
     * @returns Observable
     */
    public getFilmPerGenere(idGenere: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['film', 'genere', idGenere]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per ritornare le serie tv attraverso le api
     * 
     * @returns Observable
    */
    public getSerieTvTotali(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per ricerca una serie specifica
     * @param val nome della serie da cercare
     * @returns Observable
     */
    public getSeriePerNome(val: string): Observable<I_rispostaserver> {
        const risorsa: string[] = [`serie/search?titolo=${val}`]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    public getSeriePerId(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', id]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per ricerca le serie appartenenti al genere passato
     * @param idGenere ID del genere
     * @returns Observable
     */
    public getSeriePerGenere(idGenere: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', 'genere', idGenere]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione che ritorna gli episodi totali appartenenti ad una serie-tv
     * @param idGenere ID del genere
     * @returns Observable
    */
    public getEpisodiSerie(idSerie: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', idSerie, 'episodi']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per ricercare gli episodi di una stagione di una serie-tv
     * @param stagione numero della stagione da ricercare
     * @param idSerie number ID della serie-tv
     * @returns Observable
     */
    public getEpisodiStagione(idSerie: string, stagione: number): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', idSerie, `episodi?stagione=${stagione}`]
        return this.richiestaGenerica(risorsa, 'GET')
    }
    /**
     * Funzione per la ricerca dell'episodio specifico della serie
     * @param idGenere ID del genere
     * @returns Observable
    */
    public getEpisodio(idSerie: string, idEpisodio: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', idSerie, idEpisodio]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per rendere aggiungere un film alla lista preferiti
     * @param idFilm ID del film
     * @return Observable
     */
    public addFilmPrefe(idFilm: number): Observable<I_rispostaserver> {
        const risorsa: (string | number)[] = ['add-preferiti/film',idFilm]
        return this.richiestaGenerica(risorsa, 'POST', idFilm)
    }

    /**
     * Funzione per rendere aggiungere un film alla lista preferiti
     * @param idSerie ID del film
     * @return Observable
     */
    public addSeriePrefe(idSerie: number): Observable<I_rispostaserver> {
        const risorsa: (string | number)[] = ['add-preferiti/serie', idSerie]
        return this.richiestaGenerica(risorsa, 'POST',idSerie)
    }

    /**
     * Funzione per eliminare un film dalla lista preferiti
     * @param idFilm ID del film
     * @return Observable
     */
    public delFilmPrefe(idFilm: number): Observable<I_rispostaserver> {
        const risorsa: (string | number)[] = ['del-preferiti/film', idFilm]
        return this.richiestaGenerica(risorsa, 'DELETE')
    }

    /**
     * Funzione per eliminare una serie dalla lista preferiti
     * @param idSerie ID del film
     * @return Observable
     */
    public delSeriePrefe(idSerie: number): Observable<I_rispostaserver> {
        const risorsa: (string | number)[] = ['add-preferiti/serie', idSerie]
        return this.richiestaGenerica(risorsa, 'DELETE')
    }

    /**
     * Funzione che ritorna una collezione dei film preferiti
     * @returns Observable 
     */
    public getFilmPreferiti(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['preferiti/film']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione che ritorna una collezione delle serie preferite
     * @returns Observable 
     */
    public getSeriePreferite(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['preferiti/serie']
        return this.richiestaGenerica(risorsa, 'GET')
    }



    // ##########  API SERVICE PER SOLI ADMIN  #########################################################

    /**
     * Funzione admin che ritorna la lista degli utenti
     * @return Observable
     */
    public getListaUtenti(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['lista-utenti']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    public getListaUtentiByStatus(status: number | string): Observable<I_rispostaserver> {
        const risorsa: string[] = [`lista-utenti?status=${status}`]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per gli admin che serve ad eliminare un utente
     * @param id ID dell'utente da eliminare
     */
    public deleteUserProfileAdmin(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['elimina-utente', id]
        return this.richiestaGenerica(risorsa, 'DELETE')
    }
    /**
     * Funzione per l'admin per cambiare lo status di un utente
     * @param idUser ID dello user 
     * @return Observable
     */ 
    public UpdateStatusUtente(idUser: string, dati: Partial<IUser>): Observable<I_rispostaserver> {
        const risorsa: string[] = ['lista-utenti', idUser]
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }

    /**
     * Funzione per l'admin che ritorna i dati dell'utente di cui si passo l'idUser
     * @param idUser ID dello user 
     * @return Observable
     */
    public getUtente(idUser: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['lista-utenti', idUser]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione solo admin per ricercare un utente per nome o cognome
     * @param ricerca valore di ricerca
     * @returns Observable
     */
    public ricercaUtenti(ricerca: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['lista-utenti/ricerca', ricerca]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per l'admin che ritorna la lista delle configurazioni
     * @param idUser ID dello user 
     * @return Observable
     */
    public getConfigurazioni(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['configurazioni']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per l'admin che ritorna la configuarzione voluta
     * @param idUser ID della configurazione 
     * @return Observable
     */
    public getConfigurazioniById(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['configurazioni', id]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
    * Funzione per l'admin per inserire una nuova configurazione
    * @param dati risorsa da aggiungere
    * @return Observable
    */
    public postConfigurazione(dati: object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['configurazioni']
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
     * Funzione per l'admin per modificare una configurazione
     * @param dati risorsa da aggiungere
     * @return Observable
     */
    public updateConfigurazione(dati: object | null, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['configurazioni', id]
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }

    /**
     * Funzione per l'admin per eliminare una configurazione
     * @param idUser ID della configurazione 
     * @return Observable
     */
    public deleteConfigurazione(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['configurazioni', id]
        return this.richiestaGenerica(risorsa, 'DELETE')
    }

    /**
     * Funzione per l'admin per inserire un nuovo tipo di indirizzo
     * @param dati risorsa da aggiungere
     * @return Observable
     */
    public postTipoIndirizzo(dati: object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['tipo-inidirizzo']
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
     * Funzione per l'admin per modificare un tipo di indirizzo
     * @param dati risorsa da aggiungere
     * @return Observable
     */
    public updateTipoIndirizzo(dati: object | null, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['tipo-inidirizzo', id]
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }

    /**
     * Funzione per l'admin per eliminare un tipo di indirizzo
     * @param dati risorsa da aggiungere
     * @return Observable
    */
    public deleteTipoIndirizzo(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['tipo-inidirizzo', id]
        return this.richiestaGenerica(risorsa, 'DELETE')
    }

    /**
     * Funzione admin che ritorna la lista degli indirizzi
     * @return Observable
    */
    public getListaIndirizzi(): Observable<I_rispostaserver> {
        const risorsa: string[] = ['indiizzi']
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione admin che ritorna un indirizzo singolo usando il suo id
     * @param id id dell'indirizzo da ricercare
     * @return Observable
    */
    public getIndirizzoById(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['indiizzi', id]
        return this.richiestaGenerica(risorsa, 'GET')
    }

    /**
     * Funzione per l'admin per inserire un nuovo tipo di indirizzo
     * @param dati risorsa da aggiungere
     * @return Observable
    */
    public postgenere(dati: object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['genere']
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
     * Funzione per l'admin per modificare un genere
     * @param id id del genere da modificare
     * @param dati risorsa da aggiungere
     * @return Observable
    */
    public updateGenere(dati: object | null, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['genere', id]
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }

    /**
     * Funzione per l'admin per eliminare un genere
     * @param id id del genere da eliminare
     * @return Observable
    */
    public deleteGenere(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['genere', id]
        return this.richiestaGenerica(risorsa, 'DELETE')
    }

    /**
     * Funzione per l'inserimento di un film
     * @param dati risorsa da inserire
     * @return Oservable
    */
    public postFilm(dati: Object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['film']
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
     * Funzione per l'admin per modificare dei dati di un film
     * @param id id del film da modificare
     * @param dati payload 
     * @return Observable
    */
    public updateFilm(dati: object | null, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['film', id]
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }

    /**
     * Funzione per modificare la locandina 
     * @param dati payload
     * @param id ID del film
     * @returns 
     */
    public updateLocandinaFIlm(dati: FormData, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['locandina/film', id]
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
      * Funzione per modificare il video 
      * @param dati payload
      * @param id ID del film
      * @returns 
      */
    public updateVideoFIlm(dati: FormData, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['video/film', id]
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
     * Funzione per l'admin per eliminare un film
     * @param id id del film da eliminare
     * @return Observable
    */
    public deleteFilm(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['film', id]
        return this.richiestaGenerica(risorsa, 'DELETE')
    }

    /**
     * Funzione per l'inserimento di una serie
     * @param dati risorsa da inserire
     * @return Oservable
    */
    public postSerie(dati: Object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie']
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
     * Funzione per l'admin per modificare dei dati di una serie tv
     * @param id id della serie da modificare
     * @param dati payload 
     * @return Observable
    */
    public updateSerie(dati: object | null, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', id]
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }

    /**
     * Funzione per modificare la locandina di una serie tv
     * @param dati Payload
     * @param id ID della serie
     * @returns 
     */
    public updateLocandinaSerie(dati: FormData, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['locandina/serie', id]
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }


    /**
     * Funzione per l'admin per eliminare una serie
     * @param id id della serie da eliminare
     * @return Observable
    */
    public deleteSerie(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', id]
        return this.richiestaGenerica(risorsa, 'DELETE')
    }

    /**
     * Funzione per l'inserimento di un episodio
     * @param dati risorsa da inserire
     * @return Oservable
    */
    public postEpisodio(dati: Object | null): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', 'episodi']
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
     * Funzione per l'admin per modificare dei dati di un episodio
     * @param id id dell'episodio da modificare
     * @param dati payload 
     * @return Observable
    */
    public updateEpisodio(dati: object | null, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', 'episodi', id]
        return this.richiestaGenerica(risorsa, 'PUT', dati)
    }

    /**
     * Funzione per modificare il video o/e la locandina di un episodio
     * @param dati Payload
     * @param id ID dell'episodio
     * @returns 
     */
    public updateLocandinaEpisodio(dati: object, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['locandina/episodi', id]
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
     * Funzione per modificare il video di un episodio
     * @param dati Payload
     * @param id ID dell'episodio
     * @returns 
     */
    public updateVideoEpisodio(dati: FormData, id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['video/episodi', id]
        return this.richiestaGenerica(risorsa, 'POST', dati)
    }

    /**
     * Funzione per l'admin per eliminare una serie
     * @param id id della serie da eliminare
     * @return Observable
    */
    public deleteEpisodio(id: string): Observable<I_rispostaserver> {
        const risorsa: string[] = ['serie', 'episodi', id]
        return this.richiestaGenerica(risorsa, 'DELETE')
    }



}
