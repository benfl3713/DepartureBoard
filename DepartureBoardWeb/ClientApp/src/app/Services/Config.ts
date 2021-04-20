import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { environment } from "src/environments/environment";

export class Config {
  public static LoadUseAnalytics(
    http: HttpClient,
    cookieService: CookieService
  ): () => Promise<any> {
    if (environment["useAnalytics"] === true) {
      Config.EnableAnalytics(cookieService);
      return () => Promise.resolve();
    }

    return () =>
      http
        .get<boolean>(environment.apiBaseUrl + "/api/Config/UseAnalytics")
        .toPromise()
        .then((useAnalytics) => {
          if (useAnalytics === true) {
            Config.EnableAnalytics(cookieService);
          }
        })
        .catch((error) => console.log(error));
  }

  private static EnableAnalytics(cookieService: CookieService) {
    var cookie = cookieService.get("CookieScriptConsent");
    if (cookie == "") {
      return;
    }
    var cookieEnabled = JSON.parse(cookie)["action"];
    if (cookieEnabled == "accept") {
      Config.StartTracking();
    }
  }

  public static StartTracking() {
    (<any>window).ga("set", "anonymizeIp", true);
    (<any>window).ga("create", "UA-140494832-4", "auto");
    (<any>window).ga("send", "pageview");
  }
}
