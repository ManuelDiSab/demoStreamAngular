import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MioProfiloComponent } from './mio-profilo.component';

const routes: Routes = [{ path: '', component: MioProfiloComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MioProfiloRoutingModule { }
