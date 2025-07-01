export interface IComune {
    idComune:number,
    nome:string, 
    regione?:string, 
    metropolitana?:string | null, 
    provincia?:string, 
    siglaAuto:string, 
    codCat?:string,
    capoluogo?:boolean,
    multicap?:boolean,
    cap?:string, 
    capFine?:string  | null,
    capInizio?:string | null
}