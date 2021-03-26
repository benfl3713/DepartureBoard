import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  ActivatedRoute,
  Router,
  Params,
  PRIMARY_OUTLET,
  UrlSegment,
  NavigationStart,
} from "@angular/router";
import { DatePipe } from "@angular/common";
import { ToggleConfig } from "../../ToggleConfig";
import { GoogleAnalyticsEventsService } from "../../Services/google.analytics";
import { Marquee } from "dynamic-marquee";
import { DepartureService } from "src/app/Services/departure.service";
import { StationLookupService } from "src/app/Services/station-lookup.service";
import { Departure } from "src/app/models/departure.model";
import { SingleBoardResponse } from "src/app/models/singleboard-response.model";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-singleboard",
  templateUrl: "./singleboard.html",
  styleUrls: ["./singleboard.styling.css"],
})
export class SingleBoard implements OnDestroy, OnInit {
  stationCode: string;
  platform: string;
  time = new Date();
  refresher;
  noBoardsDisplay: boolean = false;
  showClock: boolean = true;
  useArrivals: boolean = false;
  showStationName = false;
  stationName;
  nextDepartures: Departure[] = [];

  //first
  firstTime: Date;
  firstPlatform: string;
  firstDestination: string;
  firstStatus: string = "";

  information: string;
  marquee;
  alternateSecondRow: boolean = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private departureService: DepartureService,
    private stationLookupService: StationLookupService
  ) {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    const s: UrlSegment[] = this.router.parseUrl(this.router.url).root.children[
      PRIMARY_OUTLET
    ].segments;
    if (s[1].path && s[1].path.toLowerCase() === "arrivals") {
      this.useArrivals = true;
    }

    if (localStorage.getItem("settings_singleboard_showStationName")) {
      this.showStationName =
        localStorage
          .getItem("settings_singleboard_showStationName")
          .toLowerCase() == "true";
    }

    if (localStorage.getItem("settings_singleboard_alternateSecondRow")) {
      this.alternateSecondRow =
        localStorage
          .getItem("settings_singleboard_alternateSecondRow")
          .toLowerCase() == "true";
    }

    route.params.subscribe(() => {
      route.queryParams.subscribe((queryParams) => {
        this.stationCode = this.route.snapshot.paramMap.get("station");
        if (queryParams["platform"]) {
          this.platform = queryParams["platform"];
        } else {
          this.platform = null;
        }

        if (queryParams["hideClock"]) {
          this.showClock = !(
            (<string>queryParams["hideClock"]).toLowerCase() === "true"
          );
        }

        if (queryParams["showStationName"]) {
          this.showStationName = queryParams["showStationName"] == "true";
        }

        ToggleConfig.LoadingBar.next(true);
        document.title =
          this.stationCode +
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
        this.GetDepartures();
        this.refresher = setInterval(() => this.GetDepartures(), 10000);
      });
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.refresher);
      }
    });
  }
  ngOnInit(): void {
    this.marquee = new Marquee(
      document.getElementById("singleboard-information"),
      {
        rate: -300,
      }
    );

    this.marquee.onAllItemsRemoved(() => {
      const $item = document.createElement("div");
      $item.textContent = this.information;
      this.marquee.appendItem($item);
    });
  }

  GetDepartures() {
    if (this.stationCode == null || this.stationCode == "") {
      return;
    }
    this.googleAnalyticsEventsService.emitEvent(
      "GetSingleBoardDepartures",
      this.stationCode,
      this.useArrivals
        ? "GetLatestArrivalsSingleBoard"
        : "GetLatestDepaturesSingleBoard"
    );
    this.departureService
      .GetSingleboardDepartures(
        this.stationCode,
        this.useArrivals,
        this.platform
      )
      .subscribe(
        (response) => {
          ToggleConfig.LoadingBar.next(false);
          this.ProcessDepartures(response);
        },
        () => ToggleConfig.LoadingBar.next(false)
      );
  }

  ProcessDepartures(data: SingleBoardResponse) {
    this.nextDepartures = [];
    this.noBoardsDisplay = data.departures.length === 0;
    if (data.information !== this.information) {
      this.information = data.information;
      this.marquee.clear();
      const $item = document.createElement("div");
      $item.textContent = this.information;
      this.marquee.appendItem($item);
    }

    // First
    this.firstTime = data.departures[0].aimedDeparture;
    this.firstPlatform = data.departures[0].platform;
    if (this.firstPlatform === "0") {
      this.firstPlatform = " ";
    }

    this.firstDestination = data.departures[0].destination;

    const tempfirststatus = data.departures[0].status;
    if (tempfirststatus === ServiceStatus.LATE) {
      const fexpected = data.departures[0].expectedDeparture;
      this.firstStatus = "Exp " + this.datePipe.transform(fexpected, "HH:mm");
    } else {
      this.firstStatus = this.toTitleCase(ServiceStatus[tempfirststatus]);
      if (this.firstStatus === "Ontime") {
        this.firstStatus = "On Time";
      }
    }

    for (let index = 1; index < data.departures.length; index++) {
      const departure = data.departures[index] as Departure;
      if (departure.status === ServiceStatus.LATE) {
        const expected = departure.expectedDeparture;
        departure.status = "Exp " + this.datePipe.transform(expected, "HH:mm");
      } else {
        departure.status = this.toTitleCase(ServiceStatus[departure.status]);
        if (departure.status === "Ontime") {
          departure.status = "On Time";
        }
      }
      this.nextDepartures.push(departure);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.refresher);
  }

  isNumber(value: string | number): boolean {
    return value != null && !isNaN(Number(value.toString()));
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
      .get(
        environment.apiBaseUrl +
          "/api/StationLookup/GetStationCodeFromName?name=" +
          stationName
      )
      .subscribe((s) => {
        if (this.useArrivals) {
          this.router.navigate(["singleboard/arrivals/", s]);
        } else {
          this.router.navigate(["singleboard/", s]);
        }
      });
  }

  toTitleCase(input: string): string {
    return input.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}

export enum ServiceStatus {
  ONTIME,
  LATE,
  CANCELLED,
  ARRIVED,
}
