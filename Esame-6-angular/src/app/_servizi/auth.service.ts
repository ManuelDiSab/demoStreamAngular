import { Injectable } from '@angular/core';
import { Auth } from '../interfaces/IAuth.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static auth: Auth

  private obsAuth$: BehaviorSubject<Auth>

  constructor() {
                          
    AuthService.auth = this.LeggiAuthDaLocalStorage() // leggo i dati dal localstorage se esistono
    this.obsAuth$ = new BehaviorSubject<Auth>(AuthService.auth) // metto un oggetto vuoto all'interno dell'observable
  }


  /**
   * 
   * @returns BehaviourSubject
   */
  LeggiObsAuth() {
    return this.obsAuth$
  }


  /**
   * Funzione per emettere il dato così che sia visibile da tutti i componenti 
   * @param dati Auth
   * @returns void
   */
  settaObsAuth(dati: Auth): void {
    AuthService.auth = dati;
    this.obsAuth$.next(dati)
  }


  /**
   * Funzione per leggere un eventuale Auth se presente nel local storage
   * @returns un oggetto Auth
   */
  LeggiAuthDaLocalStorage(): Auth {               
    const tmp: string | null = localStorage.getItem("auth") //Cerco all'interno del localstorage 'auth'
    let Auth: Auth
    if (tmp != null) {
      Auth = JSON.parse(tmp) // .parse è il contrario di stringify e trasformo tmp che è una stringa in un JSON      
    } else {
      Auth = {
        idUser: null,
        idRuolo: null,
        status: null,
        token: null,
        nome: null,
        nazione: null,
        sesso: null
      }
    }
    return Auth
  }


  /**
   * Funzione per scrivere auth sul local storage
   * @param auth Oggetto type Auth da scrivere sul local storage
   */
  scriviAuthSuLocalStorage(auth: Auth): void {
    const tmp: string = JSON.stringify(auth) // prendo il valore nel formato Auth e lo faccio diventare una stringa
    localStorage.setItem('auth', tmp) // inserisco tmp all'interno del localstorage. Il primo parametro è il nome con cui lor richiamo
  }

  /**
   * Funzione per svuotare il local storage
   * @returns void
   */
    eliminaAuthSuLocalStorage(): void {
    
    localStorage.clear()
  }


  /**
   * Funzione getter per prelevare il token
   */
  get token() {
    const value = JSON.parse(localStorage.getItem('auth')!)
    return value.token
  }
}
