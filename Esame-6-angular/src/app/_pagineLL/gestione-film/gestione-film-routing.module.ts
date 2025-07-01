import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestioneFilmComponent } from './gestione-film.component';

const routes: Routes = [{ path: '', component: GestioneFilmComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestioneFilmRoutingModule { }
