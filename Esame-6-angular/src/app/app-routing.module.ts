import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./_pagineLL/homepage/homepage.module').then(m => m.HomepageModule)},
  { path: 'homepage', loadChildren: () => import('./_pagineLL/homepage/homepage.module').then(m => m.HomepageModule) },//Homepage
  { path: 'film', loadChildren: () => import('./_pagineLL/film/film.module').then(m => m.FilmModule) },//Pagina relativa ai film
  { path: 'serie/:id', loadChildren: () => import('./_pagineLL/dettaglio-serie/dettaglio-serie.module').then(m => m.DettaglioSerieModule)},//Pagina relativa alle serie tv 
  { path: 'film/:id', loadChildren: () => import('./_pagineLL/dettaglio-film/dettaglio-film.module').then(m => m.DettaglioFilmModule) },//dettaglio film
  { path: 'login', loadChildren: () => import('./_pagineLL/login/login.module').then(m => m.LoginModule)},//Pagina di login
  { path: 'serie', loadChildren: () => import('./_pagineLL/serie-tv/serie-tv.module').then(m => m.SerieTvModule) },//catalogo serie
  { path: 'mia-lista', loadChildren: () => import('./_pagineLL/mia-lista/mia-lista.module').then(m => m.MiaListaModule) },//Pagina relativa alla lista preferiti
  { path: 'mio-profilo', loadChildren: () => import('./_pagineLL/mio-profilo/mio-profilo.module').then(m => m.MioProfiloModule) },//Pagina relativa al profilo dell'utente loggato
  { path: 'register', loadChildren: () => import('./_pagineLL/registrazione/registrazione.module').then(m => m.RegistrazioneModule) },//Pagina registrazione
  { path: 'gestione', loadChildren: () => import('./_pagineLL/gestione/gestione.module').then(m => m.GestioneModule) },//Pagina di gestione delle risorse(SOLO ADMIN)
  { path: 'ricerca/:ricerca', loadChildren: () => import('./_pagineLL/ricerca/ricerca.module').then(m => m.RicercaModule) },
  { path: 'genere/:genere', loadChildren: () => import('./_pagineLL/genere/genere.module').then(m => m.GenereModule) },
  { path: 'gestione-episodi', loadChildren: () => import('./_pagineLL/gestione-episodi/gestione-episodi.module').then(m => m.GestioneEpisodiModule) },
  { path: '**', loadChildren: () => import('./_pagineLL/pagina404/pagina404.module').then(m => m.Pagina404Module) }//Pagina di errore
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
