import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export class Config {
  public static LoadUseAnalytics(http: HttpClient, cookieService: CookieService): () => Promise<any> {
    return () => http.get<boolean>("/api/Config/UseAnalytics").toPromise().then(useAnalytics => {
      if (useAnalytics === true) {
        var cookie = cookieService.get("CookieScriptConsent");
        if (cookie == "") { return;}
        var cookieEnabled = JSON.parse(cookie)["action"];
        if (cookieEnabled == "accept") {
          Config.StartTracking();
        }
      }
    });
  }

  public static StartTracking() {
    (<any>window).ga('create', 'UA-140494832-4', 'auto');
    (<any>window).ga('send', 'pageview');
    //LogRocket.init('led-departure-board/led-departure-board');
  }
}
