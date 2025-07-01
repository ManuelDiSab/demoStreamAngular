import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordConfirmationValidator(
    password1: string,
    confirm_password: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(password1);
      const confirmPasswordControl = formGroup.get(confirm_password);
  
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
  
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
  
      return null;
    };
  }

export function controlloPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value
    let valido:number = ( /[a-z]/.test(password)) ? 0 : 1
    if(valido === 0 ){
        valido += (/[A-Z]/.test(password)) ? 0 : 1
        if(valido === 0){
            valido +=  /[0-9]/.test(password) ? 0 : 1
            if(valido === 0){
                valido +=  /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password) ? 0 : 1
                if(valido === 0 ){
                    console.log('password sicura')
                }else{
                    return { controlloPassword:'La password deve avere almeno un carattere speciale'}
                }
            } else{
                return { controlloPassword:'La password deve avere almeno un numero'}
            }
        }else{
            return { controlloPassword:'La password deve avere almeno una lettera maiuscola'}
        }
    }else{
        return { controlloPassword:'La password deve avere almeno una lettera minuscola'}
    }

    return null
    
}


export function controlCodFiscale(control: AbstractControl): ValidationErrors | null {
    const codf = control.value as string
    let valido: number = (codf.length === 16) ? 0 : 1;

    if (valido === 0) {
        // console.log('Codice lungo esattamente 16 caratteri')
        let char: string = codf.substring(0, 6);
        let regExp = new RegExp(/^[a-zA-Z]+$/);
        valido += (regExp.test(char)) ? 0 : 1;

        if (valido === 0) {
            console.log('I primi 6 caratteri delcodice fiscale sono corretti: ');
            // Controllo del settimo e ottavo carattere
            char = codf.substring(6, 8);
            regExp = new RegExp(/^[0-9]+$/);
            valido += (regExp.test(char)) ? 0 : 1;

            if (valido === 0) {
                console.log('Il settimo e ottavo carattere sono giusti ');
                //Controllo del nono carattere
                char = codf.substring(8, 9);
                regExp = new RegExp(/^[a-zA-Z]+$/);
                valido += (regExp.test(char)) ? 0 : 1;

                // controllo del decimo e undicesimo carattere
                if (valido === 0) {
                    console.log('Il nono carattere è correttamente una lettera: ');
                    char = codf.substring(9, 11);
                    regExp = new RegExp(/^[0-9]+$/);
                    valido += (regExp.test(char)) ? 0 : 1;

                    if (valido === 0) {
                        // controllo del dodicesimo carattere 
                        console.log('Il decimo e undicesimo carattere sono giusti ');
                        char = codf.substring(11, 12);
                        regExp = new RegExp(/^[a-zA-Z]+$/);
                        valido += (regExp.test(char)) ? 0 : 1;

                        if (valido === 0) {
                            //Controllo del tredicesimo,quattordicesimo e quindicesimo carattere
                            console.log('Il dodicesimo carattere è correttamente un numero: ');
                            char = codf.substring(12, 15);
                            regExp = new RegExp(/^[0-9]+$/);
                            valido += (regExp.test(char)) ? 0 : 1;

                            if (valido === 0) {
                                console.log('Il tredicesimo,quattordicesimo e quindicesimo carattere sono correttamente delle lettere: ');
                                //controllo del sedicesimo ed ultimo carattere
                                char = codf.substring(15, 16);
                                regExp = new RegExp(/^[a-zA-Z]+$/);
                                valido = (regExp.test(char)) ? 0 : 1

                                if (valido === 0) {
                                    console.log('Anche il sedicesimo carattere è corretto ');
                                } else {
                                    return { controlCodFiscale: 'Il sedicesimo carattere deve essere una lettera' }
                                }
                            } else {
                                return { controlCodFiscale: 'Il tredicesimo, quattordicesimo e quindicesimo carattere devono essere numeri' }
                            }
                        } else {
                            return { controlCodFiscale: 'Il dodicesimo deve essere un numero' }
                        }
                    } else {
                        return { controlCodFiscale: 'Il decimo e undicesimo carattere devono essere numeri' }
                    }
                } else {
                    return { controlCodFiscale: 'Il nono carattere deve essere una lettera' }
                }
            } else {
                return { controlCodFiscale: "Il settimo e l'ottavo carattere devono essere numeri" }
            }


        } else {
            return { controlCodFiscale: 'I primi 6 caratteri devono essere lettere :' }
        }

    } else {
        return { controlCodFiscale: 'Il codice deve essere lungo esattamente 16 caratteri' }
    }
    return null


}

export const codFis: RegExp = (/^[A-Z]{6}[0-9]{2}[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]{1}$/i);//Faccio il controllo del codice 
//   let valido: number = (regExp.test(codFis)) ? 0 : 1; //Assegno ad un numero una variabile tra 0 e 1 dove lo 0 indicherà true e 1 indicherà false
export const StrongPasswordRegx: RegExp =  //Validator per la forza della password
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;



