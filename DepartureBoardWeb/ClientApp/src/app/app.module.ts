import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { DatePipe } from "@angular/common";

import { MaterialModule } from "./external/material.module";
import { DeviceDetectorModule } from "ngx-device-detector";
import { CookieService } from "ngx-cookie-service";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NotifierModule } from "angular-notifier";
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
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
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
import { FeaturesComponent } from './widgets/features/features.component';
import { ROUTES } from "./routes";
import { BoardSkeletonComponent } from './Components/board-skeleton/board-skeleton.component';
import { BlackCardStyle1Component } from "./Components/cards/black-card-style1/black-card-style1.component";
import { BlackSectionTitleComponent } from "./Components/black-section-title/black-section-title.component";
import { BlackCardStyle2Component } from './Components/black-card-style2/black-card-style2.component';
import { NavMenuMobileComponent } from './nav-menu/nav-menu-mobile/nav-menu-mobile.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';

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
    FeaturesComponent,
    BoardSkeletonComponent,
    BlackCardStyle1Component,
    BlackSectionTitleComponent,
    BlackCardStyle2Component,
    NavMenuMobileComponent,
    ContactUsComponent
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
    FlexLayoutModule,
    SettingsModule,
    NgxSkeletonLoaderModule,
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
    RouterModule.forRoot(ROUTES, { relativeLinkResolution: 'legacy', anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot(),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.enablePWA,
      registrationStrategy: "registerImmediately",
    }),
  ],
  providers: [
    DatePipe,
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
