import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ToggleConfig } from './ToggleConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    './fonts/ledfont/stylesheet.css',
    './fonts/ledfont2/stylesheet.css',]
})
export class AppComponent {
  title = 'app';
  showHome: boolean = true;
  LoadingBar: boolean = false;
  timer;

  constructor(private router: Router, private route: ActivatedRoute) {
    ToggleConfig.LoadingBar.subscribe(isvisible => this.LoadingBar = isvisible);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
        //Show/Hide Menus
        clearTimeout(this.timer);
        this.timer = null;
        this.showHome = true;
        if (event.urlAfterRedirects != "/" && event.urlAfterRedirects != "/search") {
          this.SetTimer();
        }
      }
    });
  }

  SetTimer(): void {
    this.timer = setTimeout(() => this.showHome = false, 5000);
  }

  @HostListener('document:mousemove', ['$event']) 
  ResetTimer(e) {
    if (this.timer && this.timer != null) {
      this.showHome = true;
      clearTimeout(this.timer);
      this.SetTimer();
    }
  }

}
