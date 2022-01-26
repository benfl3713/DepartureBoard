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

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent {
  showHome: boolean = true;
  isBetaEnabled = localStorage.getItem("settings_general_betaFeatures") === "true";
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
      if (event instanceof RouteConfigLoadStart) {
        ToggleConfig.LoadingBar.next(true);
      } else if (event instanceof RouteConfigLoadEnd) {
        ToggleConfig.LoadingBar.next(false);
      }
    });
  }

  SetTimer(): void {
    this.timer = setTimeout(() => (this.showHome = false), 3000);
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


    navItemList: any = [
      {
        href: '/', title: 'Home',
        routerLinkActiveOptions: { exact: true },
        is_link: true,
        icon: "fas fa-home"
      },
      { href: '/search', title: 'Search', is_link: true, icon: "fas fa-search" },
      { href: '/examples', title: 'Examples', is_link: true, icon: "far fa-lightbulb" },
      { href: '', title: 'Boards', is_link: false, children: true, child: [
        { href: '/custom-departures', title: 'Custom', is_link: true, icon: "fas fa-chalkboard" },
        { href: '/buses', title: 'Buses', is_link: true, icon: "fas fa-bus" },
      ] },
      { href: '', title: 'Learn', is_link: false, children: true, child: [
        { href: '/about', title: 'About', is_link: true },
        { href: 'https://docs.leddepartureboard.com', title: 'Docs', is_link: true, use_href: true },
      ] },
      { href: '/settings', title: 'Settings', is_link: true, icon: "fas fa-cogs" },
      { href: 'https://admin.leddepartureboard.com', title: 'Admin', is_link: true, use_href: true, icon: "fas fa-external-link-alt" },
      // {
      //   href: '#blog', title: 'Blog',
      //   is_link: false,
      //   _is_active: false,
      //   children: true,
      //   child: [
      //     { href: '/sofbox-saas/blog-list', title: 'All Blog' },
      //     { href: '/sofbox-saas/blog-detail', title: 'Blog Detail' },
      //     { href: '/sofbox-saas/blog-detail-left-sidebar', title: 'Blog Details Left Sidebar' },
      //     { href: '/sofbox-saas/blog-detail-right-sidebar', title: 'Blog Details Right Sidebar' },
      //     { href: '/sofbox-saas/blog-list-left-sidebar', title: 'Blog Left Sidebar' },
      //     { href: '/sofbox-saas/blog-list-right-sidebar', title: 'Blog Right Sidebar' },
      //   ]
      // },
    ];
}
