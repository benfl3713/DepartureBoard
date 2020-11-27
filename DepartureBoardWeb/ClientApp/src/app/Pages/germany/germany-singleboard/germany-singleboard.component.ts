import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  Params,
  PRIMARY_OUTLET,
  Router,
  UrlSegment,
} from "@angular/router";
import { Departure } from "src/app/models/departure.model";
import { DepartureService } from "src/app/Services/departure.service";
import { StationLookupService } from "src/app/Services/station-lookup.service";
import { ToggleConfig } from "src/app/ToggleConfig";

@Component({
  templateUrl: "./germany-singleboard.component.html",
  styleUrls: ["./germany-singleboard.component.css"],
})
export class GermanySingleboardComponent implements OnInit {
  constructor(
    private departureService: DepartureService,
    private route: ActivatedRoute,
    private router: Router,
    private stationLookupService: StationLookupService,
    private http: HttpClient
  ) {
    this.route.params.subscribe(() => {
      this.route.queryParams.subscribe((queryParams) => {
        this.SetupDisplay(queryParams);
      });
    });
  }

  time = new Date();
  refresher;
  noBoardsDisplay: boolean = false;
  useArrivals: boolean = false;
  showStationName: boolean = false;
  stationName;
  public platform: string;
  public stationCode: string;
  departure: Departure;

  ngOnInit(): void {}

  SetupDisplay(queryParams) {
    const s: UrlSegment[] = this.router.parseUrl(this.router.url).root.children[
      PRIMARY_OUTLET
    ].segments;
    if (s[0].path && s[0].path.toLowerCase() == "arrivals") {
      this.useArrivals = true;
    }

    this.stationCode = this.route.snapshot.paramMap.get("station");

    if (localStorage.getItem("settings_mainboard_showStationName")) {
      this.showStationName =
        localStorage
          .getItem("settings_mainboard_showStationName")
          .toLowerCase() == "true";
    }

    if (queryParams["showStationName"]) {
      this.showStationName = queryParams["showStationName"] == "true";
    }

    if (queryParams["platform"]) {
      this.platform = queryParams["platform"];
    } else {
      this.platform = null;
    }

    document.title =
      this.stationCode.toUpperCase() +
      (this.useArrivals ? " - Arrivals" : " - Departures") +
      " - Departure Board";

    this.stationLookupService
      .GetStationNameFromCode(this.stationCode)
      .subscribe((name) => {
        document.title =
          name +
          (this.useArrivals ? " - Arrivals" : " - Departures") +
          " - Departure Board";
        this.stationName = name;
        if (this.platform) {
          this.stationName = `${name} (Platform ${this.platform})`;
        }
      });

    ToggleConfig.LoadingBar.next(true);
    this.GetDepartures();
    this.refresher = setInterval(() => this.GetDepartures(), 32000);
  }

  GetDepartures() {
    this.departureService
      .GetDepartures(this.stationCode, 1, false, this.platform, "DEUTSCHEBAHN")
      .subscribe(
        (departures) => {
          console.log(departures);
          ToggleConfig.LoadingBar.next(false);
          if (departures && departures.length > 0) {
            this.departure = departures[0];
          } else {
            this.departure = null;
          }
        },
        () => ToggleConfig.LoadingBar.next(false)
      );
  }

  GetStopsText(): string {
    if (!this.departure) {
      return "";
    }

    return this.departure.stops.map((s) => s.stationName).join(" - ");
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
        if (!s) {
          return;
        }
        if (this.useArrivals) {
          this.router.navigate(["germany/singleboard/arrivals/", s]);
        } else {
          this.router.navigate(["germany/singleboard/", s]);
        }
      });
  }
}
