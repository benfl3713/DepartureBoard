import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  showHome: boolean = true;
  showMainBoardOptions: boolean = false;

  timer;
  displays;

  constructor(private router: Router, private route: ActivatedRoute, private deviceService: DeviceDetectorService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //Show/Hide Menus
        clearTimeout(this.timer);
        this.timer = null;
        this.showHome = true;
        if (event.urlAfterRedirects != "/" && event.urlAfterRedirects != "/search" && event.urlAfterRedirects != "/examples" && !this.deviceService.isMobile()) {
          //this.showMainBoardOptions = !event.urlAfterRedirects.includes("singleboard")
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
