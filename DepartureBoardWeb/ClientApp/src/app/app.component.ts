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
import { CookieService } from "ngx-cookie-service";

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
    adminBoardService: AdminBoardService,
    route: ActivatedRoute,
    cookieService: CookieService
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
      if (event instanceof NavigationStart) {
        ToggleConfig.LoadingBar.next(false);
      }
    });

    route.queryParams.subscribe((params) => {
      if (
        params.acceptCookies == "true" &&
        !cookieService.check("CookieScriptConsent")
      ) {
        console.log("Auto Accepted Cookie Policy");
        this.setCookie(
          "CookieScriptConsent",
          `{"action":"accept","categories":"[\\"targeting\\",\\"unclassified\\"]"}`,
          90
        );
        window.location.reload();
      }

      if (params.token) {
        localStorage.setItem("settings_departureadmin_uid", params.token);
        localStorage.setItem("settings_departureadmin_enabled", "true");
        GlobalEvents.SettingsChanged.emit();
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
    GlobalEvents.SettingsChanged.subscribe(() => {
      adminBoardService.stopListening();
      adminBoardService.startListening(this.router);
    });
  }

  CheckForUpdate() {
    this.updates.available.subscribe(() => {
      this.updates.activateUpdate().then(() => document.location.reload());
    });
  }

  private setCookie(
    name: string,
    value: string,
    expireDays: number,
    path: string = ""
  ) {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : "";
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }
}
