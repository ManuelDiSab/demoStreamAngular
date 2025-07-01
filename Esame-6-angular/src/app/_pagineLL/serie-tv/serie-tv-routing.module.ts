import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SerieTvComponent } from './serie-tv.component';

const routes: Routes = [{ path: '', component: SerieTvComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SerieTvRoutingModule { }
