import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestioneUtentiComponent } from './gestione-utenti.component';

const routes: Routes = [{ path: '', component: GestioneUtentiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestioneUtentiRoutingModule { }
