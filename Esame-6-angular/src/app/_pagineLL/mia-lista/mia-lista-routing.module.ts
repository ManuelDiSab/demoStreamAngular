import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiaListaComponent } from './mia-lista.component';

const routes: Routes = [{ path: '', component: MiaListaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiaListaRoutingModule { }
