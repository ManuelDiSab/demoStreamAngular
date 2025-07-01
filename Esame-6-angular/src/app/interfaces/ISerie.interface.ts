
export interface ISerie {
    idSerie:number,
    voto:string,
    film:false,
    idGenere:number,
    genere:string,
    titolo:string,
    trama:string, 
    n_stagioni:number, 
    anno:string, 
    anno_fine:string | null,
    path:string,
    preferito:boolean
}