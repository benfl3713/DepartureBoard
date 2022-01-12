import { Route } from "@angular/router";
import { AboutDepartureboardAdminComponent } from "./Pages/about/about-departureboard-admin/about-departureboard-admin.component";
import { AboutComponent } from "./Pages/about/about.component";
import { BoardsComponent } from "./Pages/boards/boards.component";
import { AboutCustomDepartureComponent } from "./Pages/custom-departure-board/about-custom-departure/about-custom-departure.component";
import { AddCustomDepartureComponent } from "./Pages/custom-departure-board/add-custom-departure/add-custom-departure.component";
import { CustomDepartureBoardComponent } from "./Pages/custom-departure-board/custom-departure-board.component";
import { ExamplesComponent } from "./Pages/examples/examples.component";
import { HomeComponent } from "./Pages/home/home.component";
import { SingleBoard } from "./Pages/singleboard/singleboard";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";

export const ROUTES: Route[] = [
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
      loadChildren: () => import("./Pages/buses/buses/buses.module").then((m) => m.BusesModule),
  },
  {
      path: "germany",
      loadChildren: () => import("./Pages/germany/germany.module").then((m) => m.GermanyModule),
  },
  { path: ":station", component: BoardsComponent, pathMatch: "full" },
  {
      path: ":station/:displays",
      component: BoardsComponent,
      pathMatch: "full",
  },
  {
      path: "germany",
      loadChildren: () => import("./Pages/germany/germany.module").then((m) => m.GermanyModule),
  },
  { path: "**", redirectTo: "" },
];
