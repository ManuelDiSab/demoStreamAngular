import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestioneGeneriComponent } from './gestione-generi.component';

const routes: Routes = [{ path: '', component: GestioneGeneriComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestioneGeneriRoutingModule { }
