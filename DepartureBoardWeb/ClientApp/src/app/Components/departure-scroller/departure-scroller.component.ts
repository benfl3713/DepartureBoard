import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Departure } from "src/app/models/departure.model";
import { Router, Params } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-departure-scroller",
  templateUrl: "./departure-scroller.component.html",
  styleUrls: ["./departure-scroller.component.css"],
})
export class DepartureScrollerComponent implements OnInit, OnChanges {
  @Input() departures: Departure[] = [];
  @Input() enableScoll: boolean = true;
  @Input() useArrivals: boolean = false;
  index = 0;
  timer;
  currentCount;
  currentTime;
  currentPlatform;
  currentDestination;
  currentStatus;
  constructor(private router: Router, private http: HttpClient) {
    if (this.enableScoll == true) {
      this.timer = setInterval(() => this.changeDeparture(), 15000);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (localStorage.getItem("debug") === "true") {
      console.log(
        !this.arraysAreEqual(
          changes.departures.currentValue,
          changes.departures.previousValue
        )
      );
    }
    this.setDeparture(this.departures[0]);
    if (
      this.departures.length > 0 &&
      !this.arraysAreEqual(
        changes.departures.currentValue,
        changes.departures.previousValue
      )
    ) {
      this.index = 0;
      this.currentCount = 2;
      this.setDeparture(this.departures[0]);
    }

    if (this.enableScoll == true && !this.timer) {
      this.timer = setInterval(() => this.changeDeparture(), 15000);
    } else if (this.enableScoll == false && this.timer) {
      clearInterval(this.timer);
    }
  }

  ngOnInit() {}

  changeDeparture() {
    if (!this.departures || this.departures.length === 0) {
      return;
    }

    if (this.index >= this.departures.length - 1) {
      this.index = 0;
    } else {
      this.index++;
    }

    this.currentCount = this.index + 2;
    return this.setDeparture(this.departures[this.index]);
  }

  setDeparture(departure: Departure) {
    if (departure) {
      this.currentTime = departure.aimedDeparture;
      this.currentPlatform = departure.platform;
      this.currentDestination = departure.destination;
      this.currentStatus = departure.status;
    }
  }

  getNumberWithOrdinal(n) {
    if (!n) {
      return "";
    }
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  arraysAreEqual(ary1, ary2) {
    if (!ary1 || !ary2) {
      return false;
    }
    return ary1.join("") === ary2.join("");
  }

  FilterPlatform(platform: string) {
    if (platform) {
      const queryParams: Params = { platform };
      this.router.navigate([], {
        queryParams: queryParams,
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
    }
  }

  ChangeStation(stationName: string) {
    this.http
      .get("/api/StationLookup/GetStationCodeFromName?name=" + stationName)
      .subscribe((s) => {
        if (this.useArrivals) {
          this.router.navigate(["singleboard/arrivals/", s]);
        } else {
          this.router.navigate(["singleboard/", s]);
        }
      });
  }
}
