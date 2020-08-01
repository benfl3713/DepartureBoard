import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusesComponent } from './buses.component';

const routes: Routes = [{ path: '', component: BusesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusesRoutingModule { }
