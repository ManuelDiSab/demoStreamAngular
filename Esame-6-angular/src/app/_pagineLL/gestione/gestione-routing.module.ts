import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestioneComponent } from './gestione.component';

const routes: Routes = [{
   path: '',
   component: GestioneComponent,
   children: [
      { path: 'film', loadChildren: () => import('../../_pagineLL/gestione-film/gestione-film.module').then(m => m.GestioneFilmModule) },
      { path: 'serie', loadChildren: () => import('../../_pagineLL/gestione-serie/gestione-serie.module').then(m => m.GestioneSerieModule) },
      { path: 'utenti', loadChildren: () => import('../../_pagineLL/gestione-utenti/gestione-utenti.module').then(m => m.GestioneUtentiModule) },
      { path: 'generi', loadChildren: () => import('../../_pagineLL/gestione-generi/gestione-generi.module').then(m => m.GestioneGeneriModule) },
   ]
}];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class GestioneRoutingModule { }
