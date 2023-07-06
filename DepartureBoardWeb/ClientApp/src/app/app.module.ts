import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { DatePipe, DecimalPipe } from "@angular/common";

import { MaterialModule } from "./external/material.module";
import { CookieService } from "ngx-cookie-service";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

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
import { SettingsModule } from "./settings/settings.module";
import { CustomDepartureBoardComponent } from "./Pages/custom-departure-board/custom-departure-board.component";
import { AddCustomDepartureComponent } from "./Pages/custom-departure-board/add-custom-departure/add-custom-departure.component";
import { AboutCustomDepartureComponent } from "./Pages/custom-departure-board/about-custom-departure/about-custom-departure.component";
import { DepartureService } from "./Services/departure.service";
import { StationLookupService } from "./Services/station-lookup.service";
import { AdminBoardService } from "./Services/admin-board.service";
import { ComingSoonWidgetComponent } from "./widgets/coming-soon/coming-soon.component";
import { AboutDepartureboardAdminComponent } from "./Pages/about/about-departureboard-admin/about-departureboard-admin.component";
import { AboutComponent } from "./Pages/about/about.component";
import { BusDepartureService } from "./Services/bus-departure.service";
import { DepartureScrollerComponent } from "./Components/departure-scroller/departure-scroller.component";
import { RouteTransformerDirective } from "./Utils/routetransformer.directive";
import { BetaFeaturesGuard } from "./Guards/beta-features.guard";
import {
  DepartureStopDialog,
  EditCustomDepartureComponent,
} from "./Components/edit-custom-departure/edit-custom-departure.component";
import { SplashScreenComponent } from "./Components/splash-screen/splash-screen.component";
import { ROUTES } from "./routes";
import { BoardSkeletonComponent } from './Components/board-skeleton/board-skeleton.component';
import { BlackCardStyle1Component } from "./Components/cards/black-card-style1/black-card-style1.component";
import { BlackSectionTitleComponent } from "./Components/black-section-title/black-section-title.component";
import { BlackCardStyle2Component } from './Components/black-card-style2/black-card-style2.component';
import { NavMenuMobileComponent } from './nav-menu/nav-menu-mobile/nav-menu-mobile.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { AnnouncementService } from "./Services/announcement.service";
import { SearchPageComponent } from './Components/search-page/search-page.component';
import {BoardModernRgb} from "./Pages/boards/board-modern-rgb/board-modern-rgb";

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
    BoardModernRgb,
    SearchComponent,
    NewsWidgetComponent,
    FooterComponent,
    CustomDepartureBoardComponent,
    AddCustomDepartureComponent,
    AboutCustomDepartureComponent,
    ComingSoonWidgetComponent,
    AboutDepartureboardAdminComponent,
    AboutComponent,
    DepartureScrollerComponent,
    RouteTransformerDirective,
    EditCustomDepartureComponent,
    DepartureStopDialog,
    SplashScreenComponent,
    BoardSkeletonComponent,
    BlackCardStyle1Component,
    BlackSectionTitleComponent,
    BlackCardStyle2Component,
    NavMenuMobileComponent,
    ContactUsComponent,
    SearchPageComponent
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
    SettingsModule,
    NgxSkeletonLoaderModule,
    RouterModule.forRoot(ROUTES, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    BrowserAnimationsModule,
    // ServiceWorkerModule.register("ngsw-worker.js", {
    //   enabled: environment.enablePWA,
    //   registrationStrategy: "registerImmediately",
    // }),
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    GoogleAnalyticsEventsService,
    {
      provide: APP_INITIALIZER,
      useFactory: Config.LoadUseAnalytics,      deps: [HttpClient, CookieService],
      multi: true,
    },
    CookieService,
    DepartureService,
    StationLookupService,
    AdminBoardService,
    BusDepartureService,
    RouteTransformerDirective,
    BetaFeaturesGuard,
    AnnouncementService
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
