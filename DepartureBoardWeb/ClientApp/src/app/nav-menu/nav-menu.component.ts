import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  showHome: boolean = true;
  timer;
  fixedMenuPages: Array<string> = ["/", "/search", "/examples", "/settings", "/custom-departures", "/custom-departures/add"];

  constructor(private router: Router, private route: ActivatedRoute, private deviceService: DeviceDetectorService, public auth: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //Show/Hide Menus
        clearTimeout(this.timer);
        this.timer = null;
        this.showHome = true;
        //hides menu if parameter is supplied
        if (event.urlAfterRedirects.split("?").length > 1 && event.urlAfterRedirects.split("?")[1].includes("hideMenu=true")) {
          this.showHome = false;
          return;
        }
        if (!this.fixedMenuPages.includes(event.urlAfterRedirects) && !this.deviceService.isMobile()) {
          this.SetTimer();
        }
      }
    });
  }

  SetTimer(): void {
    this.timer = setTimeout(() => this.showHome = false, 3000);
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  ResetTimer(e) {
    if (this.timer && this.timer != null) {
      this.showHome = true;
      clearTimeout(this.timer);
      this.SetTimer();
    }
  }
}
