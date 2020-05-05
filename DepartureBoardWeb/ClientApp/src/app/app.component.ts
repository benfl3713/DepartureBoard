import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ToggleConfig } from './ToggleConfig';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Config } from './Services/Config';
import { ThemeService } from './Services/ThemeService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    './fonts/ledfont/stylesheet.css',
    './fonts/ledfont2/stylesheet.css',]
})
export class AppComponent {
  title = 'app';
  LoadingBar: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private deviceService: DeviceDetectorService) {
    ToggleConfig.LoadingBar.subscribe(isvisible => this.LoadingBar = isvisible);
    ThemeService.LoadTheme();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });

    window.addEventListener('CookieScriptAcceptAll', function () {
      Config.StartTracking();
    })
  }
}
