export interface IAnagrafica {
    idUser:number, 
    idNazione:number, 
    cod_fis:string, 
    dataNascita:Date,
    comuneNascita:string,
    sesso:'0' | '1'
}