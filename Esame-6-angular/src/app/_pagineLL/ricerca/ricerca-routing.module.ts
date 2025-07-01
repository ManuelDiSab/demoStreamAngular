import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RicercaComponent } from './ricerca.component';

const routes: Routes = [{ path: '', component: RicercaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RicercaRoutingModule { }
