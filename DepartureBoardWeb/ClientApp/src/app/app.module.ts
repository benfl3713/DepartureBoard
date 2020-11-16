import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { DatePipe } from "@angular/common";
import { MaterialModule } from "./material.module";
import { DeviceDetectorModule } from "ngx-device-detector";
import { CookieService } from "ngx-cookie-service";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { NotifierModule } from "angular-notifier";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./Pages/home/home.component";
import { BoardsComponent } from "./Pages/boards/boards.component";
import { SingleBoard } from "./Pages/singleboard/singleboard";
import { ExamplesComponent } from "./Pages/examples/examples.component";

import { Board } from "./Pages/boards/board/board";
import { SearchComponent } from "./search/search.component";
import { NewsWidgetComponent } from "./widgets/news/news.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GoogleAnalyticsEventsService } from "./Services/google.analytics";
import { Config } from "./Services/Config";
import { FooterComponent } from "./footer/footer.component";
import { SettingsComponent } from "./settings/settings.component";
import { CustomDepartureBoardComponent } from "./Pages/custom-departure-board/custom-departure-board.component";
import { AddCustomDepartureComponent } from "./Pages/custom-departure-board/add-custom-departure/add-custom-departure.component";
import { AboutCustomDepartureComponent } from "./Pages/custom-departure-board/about-custom-departure/about-custom-departure.component";
import { DepartureService } from "./Services/departure.service";
import { StationLookupService } from "./Services/station-lookup.service";
import { ServiceWorkerModule, SwUpdate } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { AdminBoardService } from "./Services/admin-board.service";
import { ComingSoonWidgetComponent } from "./widgets/coming-soon/coming-soon.component";
import { AboutDepartureboardAdminComponent } from "./Pages/about/about-departureboard-admin/about-departureboard-admin.component";
import { AboutComponent } from "./Pages/about/about.component";
import { BusDepartureService } from "./Services/bus-departure.service";
import { DepartureScrollerComponent } from "./Components/departure-scroller/departure-scroller.component";
import { RouteTransformerDirective } from "./Utils/routetransformer.directive";

const firebaseConfig = {
  apiKey: "AIzaSyBCYNEHPUwXR2UnqhJMdR5goqbq0fy1vdo",
  authDomain: "leddepartureboard.firebaseapp.com",
  databaseURL: "https://leddepartureboard.firebaseio.com",
  projectId: "leddepartureboard",
  storageBucket: "leddepartureboard.appspot.com",
  messagingSenderId: "964139760723",
  appId: "1:964139760723:web:9550635875faecf26edaa6",
};

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
    AboutCustomDepartureComponent,
    ComingSoonWidgetComponent,
    AboutDepartureboardAdminComponent,
    AboutComponent,
    DepartureScrollerComponent,
    RouteTransformerDirective,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: "right",
        },
        vertical: {
          position: "top",
          distance: 40,
        },
      },
      behaviour: {
        autoHide: 3500,
      },
    }),
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "search", component: SearchComponent, pathMatch: "full" },
      { path: "examples", component: ExamplesComponent, pathMatch: "full" },
      { path: "settings", component: SettingsComponent, pathMatch: "full" },
      {
        path: "custom-departures",
        component: CustomDepartureBoardComponent,
        pathMatch: "full",
      },
      {
        path: "custom-departures/add",
        component: AddCustomDepartureComponent,
        pathMatch: "full",
      },
      {
        path: "custom-departures/edit/:id",
        component: AddCustomDepartureComponent,
        pathMatch: "full",
      },
      //About
      {
        path: "about",
        component: AboutComponent,
        pathMatch: "full",
      },
      {
        path: "about/custom-departures",
        component: AboutCustomDepartureComponent,
        pathMatch: "full",
      },
      {
        path: "about/departureboard-admin",
        component: AboutDepartureboardAdminComponent,
        pathMatch: "full",
      },
      //Boards
      {
        path: "arrivals/:station/:displays",
        component: BoardsComponent,
        pathMatch: "full",
      },
      {
        path: "arrivals/:station",
        component: BoardsComponent,
        pathMatch: "full",
      },
      {
        path: "singleboard/arrivals/:station",
        component: SingleBoard,
        pathMatch: "full",
      },
      {
        path: "singleboard/:station",
        component: SingleBoard,
        pathMatch: "full",
      },
      {
        path: "custom-departures/:station",
        component: BoardsComponent,
        pathMatch: "full",
      },
      {
        path: "custom-departures/:station/:displays",
        component: BoardsComponent,
        pathMatch: "full",
      },
      {
        path: "buses",
        loadChildren: () =>
          import("./Pages/buses/buses/buses.module").then((m) => m.BusesModule),
      },

      { path: ":station", component: BoardsComponent, pathMatch: "full" },
      {
        path: ":station/:displays",
        component: BoardsComponent,
        pathMatch: "full",
      },
      { path: "**", redirectTo: "" },
    ]),
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot(),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      registrationStrategy: "registerImmediately",
    }),
  ],
  providers: [
    DatePipe,
    GoogleAnalyticsEventsService,
    {
      provide: APP_INITIALIZER,
      useFactory: Config.LoadUseAnalytics,
      deps: [HttpClient, CookieService],
      multi: true,
    },
    CookieService,
    DepartureService,
    StationLookupService,
    AdminBoardService,
    BusDepartureService,
    RouteTransformerDirective,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    Board,
    SearchComponent,
    NewsWidgetComponent,
    FooterComponent,
  ],
})
export class AppModule {}
