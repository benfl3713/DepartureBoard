import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common'
import { MaterialModule } from './material.module'

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from "./home/home.component";
import { BoardsComponent } from './boards/boards.component';
import { SingleBoard } from './singleboard/singleboard';

import { Board } from './boards/board/board';
import { SearchComponent } from './search/search.component';
import { NewsWidgetComponent } from './widgets/news/news.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    BoardsComponent,
    SingleBoard,
		Board,
		SearchComponent,
		NewsWidgetComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
	  FormsModule,
	  ReactiveFormsModule,
	  MaterialModule,
    RouterModule.forRoot([
		{ path: '', component: HomeComponent, pathMatch: 'full' },
		{ path: 'search', component: SearchComponent, pathMatch: 'full' },
    { path: 'singleboard/:station', component: SingleBoard, pathMatch: 'full' },
    { path: ':station', component: BoardsComponent, pathMatch: 'full' },
    { path: ':station/:displays', component: BoardsComponent, pathMatch: 'full' },
    ]),
    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
	entryComponents: [Board, SearchComponent, NewsWidgetComponent]
})
export class AppModule { }
