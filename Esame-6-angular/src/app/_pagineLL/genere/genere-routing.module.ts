import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenereComponent } from './genere.component';

const routes: Routes = [{ path: '', component: GenereComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenereRoutingModule { }
