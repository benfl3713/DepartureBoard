import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common'

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from "./home/home.component";
import { BoardsComponent } from './boards/boards.component';
import { SingleBoard } from './singleboard/singleboard';

import { Board } from './boards/board/board';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    BoardsComponent,
    SingleBoard,
    Board
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'singleboard/:station', component: SingleBoard, pathMatch: 'full' },
      { path: ':station', component: BoardsComponent, pathMatch: 'full' },
      { path: ':station/:displays', component: BoardsComponent, pathMatch: 'full' },
    ]),
    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [Board]
})
export class AppModule { }
