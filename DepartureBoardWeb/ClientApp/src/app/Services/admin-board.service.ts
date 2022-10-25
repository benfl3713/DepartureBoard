import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./auth.service";
import { Router, Params } from "@angular/router";
import { Subscription, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
  deps: [Router],
})
export class AdminBoardService {
  constructor(private afs: AngularFirestore, public auth: AuthService) {}

  listener: Subscription;
  groupListener: Subscription;
  userListener: Subscription;

  startListening(router: Router) {
    if (!(localStorage.getItem("settings_departureadmin_enabled") == "true")) {
      return;
    }

    this.userListener = this.auth.user$.subscribe(
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
          .subscribe((document) =>
            this.processBoardDelta(document, router, user.uid)
          );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  stopListening() {
    if (this.groupListener) {
      this.groupListener.unsubscribe();
    }

    if (this.listener) {
      this.listener.unsubscribe();
    }

    if (this.userListener) {
      this.userListener.unsubscribe();
    }
  }

  processBoardDelta(document, router: Router, uid: string) {
    if (this.groupListener) {
      this.groupListener.unsubscribe();
    }

    if (document.GroupId != null) {
      return this.attachGroupListener(document.GroupId, router, uid);
    }

    return this.activateBoardConfig(document.config, router);
  }

  activateBoardConfig(config, router: Router) {
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

    if (config.stationCode.key) {
      router.navigate([this.calculateUrlOld(config)], {
        queryParams: queryParams,
      });
    } else {
      router.navigate([this.calculateUrl(config)], {
        queryParams: queryParams,
      });
    }
    console.groupEnd();
  }

  calculateUrl(config): string {
    const arrivals = config.isArrivals === true ? "/arrivals/" : "";
    const boardCount = config.boardCount ? `/${config.boardCount}/` : "";
    const toStation = config.filterToStation === true && config.toStationCode ? `/to/${config.toStationCode.code}` : "";

    if (config.boardType == "main") {
      return `${arrivals}${config.stationCode.code}${toStation}${boardCount}`;
    }
    if (config.boardType == "singleboard") {
      return `singleboard/${arrivals}${config.stationCode.code}${toStation}`;
    }

    return null;
  }

  calculateUrlOld(config): string {
    const arrivals = config.isArrivals === true ? "/arrivals/" : "";
    const boardCount = config.boardCount ? `/${config.boardCount}/` : "";
    if (config.boardType == "main") {
      return `${arrivals}${config.stationCode.key}${boardCount}`;
    }
    if (config.boardType == "singleboard") {
      return `singleboard/${arrivals}${config.stationCode.key}`;
    }

    return null;
  }

  attachGroupListener(groupId: string, router: Router, uid: string) {
    this.groupListener = this.afs
      .collection(`departureadmin/${uid}/groups`)
      .doc(groupId)
      .valueChanges()
      .subscribe((document: any) =>
        this.activateBoardConfig(document.config, router)
      );
  }
}
