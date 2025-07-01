import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestioneSerieComponent } from './gestione-serie.component';

const routes: Routes = [{ path: '', component: GestioneSerieComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestioneSerieRoutingModule { }
