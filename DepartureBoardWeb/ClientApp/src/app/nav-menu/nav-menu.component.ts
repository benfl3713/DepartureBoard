import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationStart,
} from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { AuthService } from "../Services/auth.service";
import { ToggleConfig } from "../ToggleConfig";
import { MatSidenav } from "@angular/material/sidenav";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent {
  showHome: boolean = true;
  timer;
  fixedMenuPages: Array<string> = [
    "/",
    "/search",
    "/examples",
    "/settings",
    "/custom-departures",
    "/custom-departures/add",
    "/custom-departures/edit",
    "/about",
    "/about/custom-departures",
    "/about/departureboard-admin",
    "/buses",
  ];
  @ViewChild(MatSidenav, { static: true }) public sidenav: MatSidenav;

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
        //hides menu if parameter is supplied
        if (
          event.urlAfterRedirects.split("?").length > 1 &&
          event.urlAfterRedirects.split("?")[1].includes("hideMenu=true")
        ) {
          this.showHome = false;
          return;
        }
        if (
          !this.fixedMenuPages.includes(event.urlAfterRedirects) &&
          !this.deviceService.isMobile()
        ) {
          this.SetTimer();
        }
      }
      if (event instanceof NavigationStart) {
        ToggleConfig.LoadingBar.next(false);
      }
    });
  }

  SetTimer(): void {
    this.timer = setTimeout(() => (this.showHome = false), 3000);
  }

  PageChanged() {
    this.sidenav.close();
  }

  @HostListener("document:mousemove", ["$event"])
  @HostListener("document:touchstart", ["$event"])
  ResetTimer(e) {
    if (this.timer && this.timer != null) {
      this.showHome = true;
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
}
