import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { LondonTubeSingleboardComponent } from './london-tube-singleboard/london-tube-singleboard.component';
import {
  TubeDepartureScrollerComponent
} from "./london-tube-singleboard/tube-departure-scroller/tube-departure-scroller.component";
import { LondonTubeSearchComponent } from './london-tube-search/london-tube-search.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../external/material.module";

const routes: Routes = [
  {path: "search", component: LondonTubeSearchComponent},
  { path: ":station", component: LondonTubeSingleboardComponent },
  { path: ":station/:line/:direction", component: LondonTubeSingleboardComponent },
  { path: ":station/:line", component: LondonTubeSingleboardComponent },
];

@NgModule({
  declarations: [
    LondonTubeSingleboardComponent,
    TubeDepartureScrollerComponent,
    LondonTubeSearchComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes), FormsModule, MaterialModule, ReactiveFormsModule
  ]
})
export class LondonTubeModule { }
