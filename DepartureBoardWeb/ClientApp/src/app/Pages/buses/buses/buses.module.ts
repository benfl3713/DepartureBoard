import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { BusesRoutingModule } from "./buses-routing.module";
import { BusesComponent } from "./buses.component";
import { BusSingleboardComponent } from "./bus-singleboard/bus-singleboard.component";

const routes: Routes = [
  { path: "", component: BusesComponent },
  { path: "singleboard/:atco", component: BusSingleboardComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  declarations: [BusesComponent, BusSingleboardComponent],
  imports: [CommonModule, BusesRoutingModule, RouterModule.forChild(routes)],
})
export class BusesModule {}
