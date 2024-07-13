import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationStart,
} from "@angular/router";
import { ToggleConfig } from "./ToggleConfig";
import { Config } from "./Services/Config";
import { ThemeService } from "./Services/ThemeService";
// import { SwUpdate } from "@angular/service-worker";
import { AdminBoardService } from "./Services/admin-board.service";
import { GlobalEvents } from "./GlobalEvents";
import { CookieService } from "ngx-cookie-service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {ConfigService} from "./Services/config.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "./app.component.css",
    "./fonts/ledfont/stylesheet.css",
    "./fonts/ledfont2/stylesheet.css",
    "./fonts/ledfont3/stylesheet.css",
    "./fonts/railway/stylesheet.css",
    "./fonts/LondonUnderground/stylesheet.css",
  ],
})
export class AppComponent implements AfterViewChecked {
  title = "app";
  LoadingBar: boolean = false;
  showSplashScreen = false;
  splashScreenText;

  constructor(
    private router: Router,
    // private updates: SwUpdate,
    adminBoardService: AdminBoardService,
    route: ActivatedRoute,
    cookieService: CookieService,
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef,
    private configService: ConfigService
  ) {
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
        window.dispatchEvent(new Event("CookieScriptAcceptAll"));
      } else if (
        params.acceptCookies == "false" &&
        !cookieService.check("CookieScriptConsent")
      ) {
        console.log("Auto Rejected Cookie Policy");
        this.setCookie(
          "CookieScriptConsent",
          `{"action":"reject","categories":"[]"}`,
          90
        );
      }

      if (params.token) {
        this.configService.setItem("settings_departureadmin_uid", params.token);
        this.configService.setItem("settings_departureadmin_enabled", "true");
        GlobalEvents.SettingsChanged.emit();
      }
    });

    window.addEventListener("CookieScriptAcceptAll", function () {
      Config.StartTracking();
    });

    if (environment.apiBaseUrl && environment.apiBaseUrl !== "") {
      this.PingApiService();
    }

    //this.CheckForUpdate();
    //Checks for update 30 minutes
    //setInterval(() => this.CheckForUpdate(), 1800000);

    //Setup Admin Board Service
    adminBoardService.startListening(this.router);
    GlobalEvents.SettingsChanged.subscribe(() => {
      adminBoardService.stopListening();
      adminBoardService.startListening(this.router);
    });
  }

  ngAfterViewChecked() {
    ToggleConfig.LoadingBar.subscribe((isvisible) => {
      this.LoadingBar = isvisible;
      this.changeDetector.detectChanges();
    });
  }

  CheckForUpdate() {
    this.CheckAndRemoveServiceWorkerIfDisabled();

    // this.updates.available.subscribe(() => {
    //   this.updates.activateUpdate().then(() => document.location.reload());
    // });
  }

  CheckAndRemoveServiceWorkerIfDisabled() {
    if (environment.enablePWA !== false) {
      return;
    }

    try {
      if ("caches" in window) {
        caches.keys().then(function (keyList) {
          return Promise.all(
            keyList.map(function (key) {
              return caches.delete(key);
            })
          );
        });
      }

      if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker
          .getRegistrations()
          .then(function (registrations) {
            for (let registration of registrations) {
              registration.unregister();
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
   * Pings the API Service to wake it up
   * (Mainly used to cold start the AWS lambda)
   */
  PingApiService() {
    const splashUrls = [
      "/",
      "/examples",
      "/about",
      "/buses",
      "/settings",
      "/search",
      "/contact",
    ];

    this.showSplashScreen = splashUrls.includes(location.pathname);
    this.splashScreenText = "Loading API Service";
    this.http.get(environment.apiBaseUrl + "/api/Config/Ping").subscribe({
      complete: () => {
        this.showSplashScreen = false;
        this.splashScreenText = null;
      },
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
