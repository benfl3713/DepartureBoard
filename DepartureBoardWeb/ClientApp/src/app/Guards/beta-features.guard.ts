import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
// import { NotifierService } from "angular-notifier";
import { Observable } from "rxjs";
import {NotifierService} from "../Services/notifier.service";
import {ConfigService} from "../Services/config.service";

@Injectable({
  providedIn: "root",
})
export class BetaFeaturesGuard implements CanActivate, CanActivateChild {
  constructor(private notifierService: NotifierService, private configService: ConfigService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const allowed =
      this.configService.getItem("settings_general_betaFeatures") === "true";
    if (allowed == false) {
      this.notifierService.notify("error", "Blocked - This is a beta feature");
    }
    return allowed;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(next, state);
  }
}
