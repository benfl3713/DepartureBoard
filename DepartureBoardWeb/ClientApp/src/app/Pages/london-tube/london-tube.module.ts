import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { LondonTubeSingleboardComponent } from './london-tube-singleboard/london-tube-singleboard.component';

const routes: Routes = [
  { path: ":station", component: LondonTubeSingleboardComponent },
];

@NgModule({
  declarations: [
    LondonTubeSingleboardComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class LondonTubeModule { }
