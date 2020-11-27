import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { GermanySingleboardComponent } from "./germany-singleboard/germany-singleboard.component";
import { BetaFeaturesGuard } from "src/app/Guards/beta-features.guard";
import { GermanyBoardsComponent } from "./germany-boards/germany-boards.component";
import { GermanyBoardRowComponent } from "./germany-boards/germany-board-row/germany-board-row.component";

const routes: Routes = [
  {
    path: "singleboard/:station",
    component: GermanySingleboardComponent,
    canActivate: [BetaFeaturesGuard],
  },
  { path: ":station/:displays", component: GermanyBoardsComponent },
  { path: ":station", component: GermanyBoardsComponent },
  { path: "**", redirectTo: "/" },
];

@NgModule({
  declarations: [
    GermanySingleboardComponent,
    GermanyBoardsComponent,
    GermanyBoardRowComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), FlexLayoutModule],
})
export class GermanyModule {}
