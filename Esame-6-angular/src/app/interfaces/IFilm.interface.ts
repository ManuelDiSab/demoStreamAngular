
export interface IFilm {
    film:true
    idFilm:number
    titolo:string 
    anno:string
    durata:string 
    genere:string
    idGenere:number
    generi_secondari:string | null
    trama:string 
    regista:string 
    voto:string
    path:string
    video:string
    preferito:boolean
}