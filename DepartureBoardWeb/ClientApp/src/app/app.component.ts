import { Component, OnInit, HostListener } from "@angular/core";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationStart,
} from "@angular/router";
import { ToggleConfig } from "./ToggleConfig";
import { Config } from "./Services/Config";
import { ThemeService } from "./Services/ThemeService";
import { SwUpdate } from "@angular/service-worker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AdminBoardService } from "./Services/admin-board.service";
import { GlobalEvents } from "./GlobalEvents";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "./app.component.css",
    "./fonts/ledfont/stylesheet.css",
    "./fonts/ledfont2/stylesheet.css",
    "./fonts/ledfont3/stylesheet.css",
  ],
})
export class AppComponent {
  title = "app";
  LoadingBar: boolean = false;

  constructor(
    private router: Router,
    private updates: SwUpdate,
    adminBoardService: AdminBoardService
  ) {
    ToggleConfig.LoadingBar.subscribe(
      (isvisible) => (this.LoadingBar = isvisible)
    );
    ThemeService.LoadTheme();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        ToggleConfig.LoadingBar.next(false);
        (<any>window).ga("set", "page", event.urlAfterRedirects);
        (<any>window).ga("send", "pageview");
      }
      if (event instanceof NavigationStart) {
        ToggleConfig.LoadingBar.next(true);
      }
    });

    window.addEventListener("CookieScriptAcceptAll", function () {
      Config.StartTracking();
    });

    this.CheckForUpdate();
    //Checks for update 30 minutes
    setInterval(() => this.CheckForUpdate(), 1800000);

    //Setup Admin Board Service
    adminBoardService.startListening(this.router);
    GlobalEvents.SettingsChanged.subscribe(() =>
      adminBoardService.startListening(this.router)
    );
  }

  CheckForUpdate() {
    this.updates.available.subscribe(() => {
      this.updates.activateUpdate().then(() => document.location.reload());
    });
  }
}
