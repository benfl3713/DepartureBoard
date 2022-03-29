import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationStart,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
} from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { AuthService } from "../Services/auth.service";
import { ToggleConfig } from "../ToggleConfig";
import { MatSidenav } from "@angular/material/sidenav";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";
import {navItemList} from "./menu-items"

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent {
  showHome: boolean = true;
  navItemList = navItemList;
  isBetaEnabled = localStorage.getItem("settings_general_betaFeatures") === "true";
  showMobileMenu: boolean = false;
  timer;
  fixedMenuPages: Array<string> = [
    "/",
    "/search",
    "/examples",
    "/settings",
    "/settings/general",
    "/settings/mainboard",
    "/settings/singleboard",
    "/settings/departureadmin",
    "/settings/buses",
    "/custom-departures",
    "/custom-departures/add",
    "/custom-departures/edit",
    "/about",
    "/about/custom-departures",
    "/about/departureboard-admin",
    "/buses",
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    public auth: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //Show/Hide Menus
        clearTimeout(this.timer);
        this.timer = null;
        this.showHome = true;
        document.documentElement.style.overflow = '';
        //hides menu if parameter is supplied
        if (
          event.urlAfterRedirects.split("?").length > 1 &&
          event.urlAfterRedirects.split("?")[1].includes("hideMenu=true")
        ) {
          this.showHome = false;
          document.documentElement.style.overflow = 'hidden';
          return;
        }
        if (
          !this.fixedMenuPages.includes(event.urlAfterRedirects.split("#")[0])
        ) {
          this.SetTimer();
        }
      }
      if (event instanceof NavigationStart) {
        ToggleConfig.LoadingBar.next(false);
      }
      if (event instanceof RouteConfigLoadStart) {
        ToggleConfig.LoadingBar.next(true);
      } else if (event instanceof RouteConfigLoadEnd) {
        ToggleConfig.LoadingBar.next(false);
      }
    });
  }

  SetTimer(): void {
    this.timer = setTimeout(() => {
      this.showHome = false;
      document.documentElement.style.overflow = 'hidden';
    }, 3000);
  }

  @HostListener("document:mousemove", ["$event"])
  @HostListener("document:touchstart", ["$event"])
  ResetTimer(e) {
    if (this.timer && this.timer != null) {
      this.showHome = true;
      if (document.documentElement.style.overflow == 'hidden') document.documentElement.style.overflow = '';
      clearTimeout(this.timer);
      this.SetTimer();
    }
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

    toggleMobileMenu(){
      this.showMobileMenu = !this.showMobileMenu;
    }
}
