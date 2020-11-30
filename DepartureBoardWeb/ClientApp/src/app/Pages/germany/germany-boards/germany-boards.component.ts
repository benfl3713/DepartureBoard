import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  NavigationStart,
  PRIMARY_OUTLET,
  Router,
  UrlSegment,
} from "@angular/router";
import { Departure } from "src/app/models/departure.model";
import { DepartureService } from "src/app/Services/departure.service";
import { StationLookupService } from "src/app/Services/station-lookup.service";
import { ToggleConfig } from "src/app/ToggleConfig";

@Component({
  templateUrl: "./germany-boards.component.html",
  styleUrls: ["./germany-boards.component.css"],
})
export class GermanyBoardsComponent implements OnInit, OnDestroy {
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
  ngOnDestroy(): void {
    if (this.refresher) {
      window.clearInterval(this.refresher);
    }
  }

  departures: Departure[];

  refresher;
  useArrivals: boolean = false;
  showStationName: boolean = false;
  stationName;
  displays: number = 12;
  public platform: string;
  public stationCode: string;

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

    if (this.isNumber(this.route.snapshot.paramMap.get("displays"))) {
      this.displays = Number(this.route.snapshot.paramMap.get("displays"));
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

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearInterval(this.refresher);
      }
    });
  }

  GetDepartures() {
    this.departureService
      .GetDepartures(
        this.stationCode,
        this.displays,
        false,
        this.platform,
        "DEUTSCHEBAHN"
      )
      .subscribe(
        (departures) => {
          ToggleConfig.LoadingBar.next(false);
          departures.map((d) => delete d.lastUpdated);
          this.departures = departures;
        },
        () => ToggleConfig.LoadingBar.next(false)
      );
  }

  isNumber(value: string | number): boolean {
    return value != null && !isNaN(Number(value.toString()));
  }

  trackByFn(index, departure: Departure) {
    return `${departure.aimedDeparture}_${departure.origin}_${departure.destination}_${departure.operatorName}_${departure.platform}`;
  }
}
