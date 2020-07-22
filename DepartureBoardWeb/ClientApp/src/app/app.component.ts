import { Component, OnInit, HostListener } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
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
    private snackbar: MatSnackBar,
    adminBoardService: AdminBoardService
  ) {
    ToggleConfig.LoadingBar.subscribe(
      (isvisible) => (this.LoadingBar = isvisible)
    );
    ThemeService.LoadTheme();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga("set", "page", event.urlAfterRedirects);
        (<any>window).ga("send", "pageview");
      }
    });

    window.addEventListener("CookieScriptAcceptAll", function () {
      Config.StartTracking();
    });

    this.CheckForUpdate();

    //Setup Admin Board Service
    adminBoardService.startListening(this.router);
    GlobalEvents.SettingsChanged.subscribe(() =>
      adminBoardService.startListening(this.router)
    );
  }

  CheckForUpdate() {
    this.updates.available.subscribe(() => {
      const snack = this.snackbar.open("Update Available", "Reload", {
        duration: 10000,
      });
      snack.onAction().subscribe(() => {
        this.updates.activateUpdate().then(() => document.location.reload());
      });
    });
  }
}
