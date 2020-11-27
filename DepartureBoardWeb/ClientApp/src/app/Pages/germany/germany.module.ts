import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { GermanySingleboardComponent } from "./germany-singleboard/germany-singleboard.component";
import { BetaFeaturesGuard } from "src/app/Guards/beta-features.guard";

const routes: Routes = [
  {
    path: "singleboard/:station",
    component: GermanySingleboardComponent,
    canActivate: [BetaFeaturesGuard],
  },
  { path: ":station", redirectTo: "singleboard/:station" },
  { path: "**", redirectTo: "/" },
];

@NgModule({
  declarations: [GermanySingleboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FlexLayoutModule],
})
export class GermanyModule {}
