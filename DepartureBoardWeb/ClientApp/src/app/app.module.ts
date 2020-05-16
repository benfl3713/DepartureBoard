import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common'
import { MaterialModule } from './material.module'
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CookieService } from 'ngx-cookie-service'
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import * as FirebaseConfig from './firebaseConfig.json';
import { NotifierModule } from "angular-notifier";

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from "./Pages/home/home.component";
import { BoardsComponent } from './Pages/boards/boards.component';
import { SingleBoard } from './Pages/singleboard/singleboard';
import { ExamplesComponent } from './Pages/examples/examples.component';

import { Board } from './Pages/boards/board/board';
import { SearchComponent } from './search/search.component';
import { NewsWidgetComponent } from './widgets/news/news.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleAnalyticsEventsService } from './Services/google.analytics';
import { Config } from './Services/Config';
import { FooterComponent } from "./footer/footer.component";
import { SettingsComponent } from './settings/settings.component';
import { CustomDepartureBoardComponent } from './Pages/custom-departure-board/custom-departure-board.component';
import { AddCustomDepartureComponent } from './Pages/custom-departure-board/add-custom-departure/add-custom-departure.component';
import { AboutCustomDepartureComponent } from './Pages/custom-departure-board/about-custom-departure/about-custom-departure.component';

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
    SettingsComponent,
    CustomDepartureBoardComponent,
    AddCustomDepartureComponent,
    AboutCustomDepartureComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
	  FormsModule,
	  ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(FirebaseConfig.default),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule, 
    NotifierModule.withConfig({
      position:{
        horizontal:{
          position: 'right'
        },
        vertical:{
          position: 'top',
          distance: 40
        }
      },
      behaviour:{
        autoHide: 3500
      }
    }),
    RouterModule.forRoot([
		{ path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'search', component: SearchComponent, pathMatch: 'full' },
    { path: 'examples', component: ExamplesComponent, pathMatch: 'full' },
    { path: 'settings', component: SettingsComponent, pathMatch: 'full' },
    { path: 'custom-departures', component: CustomDepartureBoardComponent, pathMatch: 'full' },
    { path: 'custom-departures/add', component: AddCustomDepartureComponent, pathMatch: 'full' },
    { path: 'custom-departures/edit/:id', component: AddCustomDepartureComponent, pathMatch: 'full' },
    //About
    { path: 'about/custom-departures', component: AboutCustomDepartureComponent, pathMatch: 'full' },
    //Boards
    { path: 'arrivals/:station/:displays', component: BoardsComponent, pathMatch: 'full' },
    { path: 'arrivals/:station', component: BoardsComponent, pathMatch: 'full' },
    { path: 'singleboard/arrivals/:station', component: SingleBoard, pathMatch: 'full' },
    { path: 'singleboard/:station', component: SingleBoard, pathMatch: 'full' },
    { path: 'custom-departures/:station', component: BoardsComponent, pathMatch: 'full' },
    { path: 'custom-departures/:station/:displays', component: BoardsComponent, pathMatch: 'full' },
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
    // { provide: APP_INITIALIZER, useFactory: AppModule.LoadFirebaseConfig, deps: [HttpClient], multi: true },
    CookieService
  ],
  bootstrap: [AppComponent],
	entryComponents: [Board, SearchComponent, NewsWidgetComponent, FooterComponent]
})
export class AppModule{
 }
