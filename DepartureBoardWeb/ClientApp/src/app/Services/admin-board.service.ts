import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./auth.service";
import { Router, Params } from "@angular/router";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
  deps: [Router],
})
export class AdminBoardService {
  constructor(private afs: AngularFirestore, public auth: AuthService) {}

  listener: Subscription;

  startListening(router: Router) {
    if (localStorage.getItem("beta_program") !== "true") {
      return;
    }

    if (!(localStorage.getItem("settings_departureadmin_enabled") == "true")) {
      return;
    }

    this.auth.user$.subscribe(
      (user) => {
        //Disable previous listener if user changes
        if (this.listener) {
          this.listener.unsubscribe();
        }

        const uid = localStorage.getItem("settings_departureadmin_uid");
        if (!user || !uid) {
          return; //User not logged in
        }

        this.listener = this.afs
          .collection(`departureadmin/${user.uid}/boards`)
          .doc(uid)
          .valueChanges()
          .subscribe((document) => this.activateBoardConfig(document, router));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  activateBoardConfig(document, router: Router) {
    const config = document.config;
    console.groupCollapsed("Departure Admin Config Changed");
    console.log("DateTime:", new Date().toLocaleString());
    console.log("Config", config);
    if (!config) {
      return;
    }

    const queryParams: Params = {
      hideClock: config.hideClock,
      hideMenu: config.hideMenu,
      platform: config.platform,
      showStationName: config.showStationName,
    };
    router.navigate([this.calculateUrl(config)], {
      queryParams: queryParams,
    });
    console.groupEnd();
  }

  calculateUrl(config): string {
    const arrivals = config.isArrivals === true ? "/arrivals/" : "";
    const boardCount = config.boardCount ? `/${config.boardCount}/` : "";
    if (config.boardType == "main") {
      return `${arrivals}${config.stationCode}${boardCount}`;
    }
    if (config.boardType == "singleboard") {
      return `singleboard/${arrivals}${config.stationCode}`;
    }

    return null;
  }
}
