import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestioneEpisodiComponent } from './gestione-episodi.component';

const routes: Routes = [{ path: '', component: GestioneEpisodiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestioneEpisodiRoutingModule { }
