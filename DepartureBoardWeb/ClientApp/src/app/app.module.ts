import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common'
import { MaterialModule } from './material.module'
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CookieService } from 'ngx-cookie-service'

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from "./home/home.component";
import { BoardsComponent } from './boards/boards.component';
import { SingleBoard } from './singleboard/singleboard';
import { ExamplesComponent } from './examples/examples.component';

import { Board } from './boards/board/board';
import { SearchComponent } from './search/search.component';
import { NewsWidgetComponent } from './widgets/news/news.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleAnalyticsEventsService } from './Services/google.analytics';
import { Config } from './Services/Config';
import { FooterComponent } from "./footer/footer.component";
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    BoardsComponent,
    SingleBoard,
    ExamplesComponent,
		Board,
		SearchComponent,
		NewsWidgetComponent,
    FooterComponent,
    SettingsComponent
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
    { path: 'examples', component: ExamplesComponent, pathMatch: 'full' },
    { path: 'settings', component: SettingsComponent, pathMatch: 'full' },
    //Boards
    { path: 'arrivals/:station/:displays', component: BoardsComponent, pathMatch: 'full' },
    { path: 'arrivals/:station', component: BoardsComponent, pathMatch: 'full' },
    { path: 'singleboard/arrivals/:station', component: SingleBoard, pathMatch: 'full' },
    { path: 'singleboard/:station', component: SingleBoard, pathMatch: 'full' },
    { path: ':station', component: BoardsComponent, pathMatch: 'full' },
    { path: ':station/:displays', component: BoardsComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '' },
    ]),
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [
    DatePipe,
    GoogleAnalyticsEventsService,
    { provide: APP_INITIALIZER, useFactory: Config.LoadUseAnalytics, deps: [HttpClient, CookieService], multi: true },
    CookieService
  ],
  bootstrap: [AppComponent],
	entryComponents: [Board, SearchComponent, NewsWidgetComponent, FooterComponent]
})
export class AppModule { }
