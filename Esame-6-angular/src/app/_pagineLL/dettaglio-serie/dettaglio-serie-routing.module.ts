import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DettaglioSerieComponent } from './dettaglio-serie.component';

const routes: Routes = [{ path: '', component: DettaglioSerieComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DettaglioSerieRoutingModule { }
