import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export class Config {
  public static LoadUseAnalytics(http: HttpClient): () => Promise<any> {
    return () => http.get<boolean>("/api/Config/UseAnalytics").toPromise().then(useAnalytics => {
      if (useAnalytics === true) { Config.StartTracking();}
    });
  }

  private static StartTracking() {
    //(<any>window).ga('create', 'UA-140494832-4', 'auto');
    //(<any>window).ga('send', 'pageview');
    //LogRocket.init('led-departure-board/led-departure-board');
  }
}
