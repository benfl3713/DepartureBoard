import { Component, Input, OnDestroy, OnInit } from "@angular/core";
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
import { Departure, ServiceStatus } from "src/app/models/departure.model";
import { SingleBoardResponse } from "src/app/models/singleboard-response.model";
import { environment } from "src/environments/environment";
import {
  BoardParametersService,
  BoardParams,
} from "src/app/Services/board-parameters.service";

@Component({
  selector: "app-singleboard",
  templateUrl: "./singleboard.html",
  styleUrls: ["./singleboard.styling.css"],
})
export class SingleBoard implements OnDestroy, OnInit {
  @Input() positionAbsolute: boolean = true;
  @Input() boardParams: BoardParams;
  @Input() changeTitle = true;
  @Input() useArrivals = false;
  nextDepartures: Departure[] = [];
  firstRow: Departure;

  time = new Date();
  refresher;
  noBoardsDisplay: boolean = false;
  stationName;
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
    private stationLookupService: StationLookupService,
    private boardParametersService: BoardParametersService
  ) {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }
  ngOnInit(): void {
    const s: UrlSegment[] = this.router.parseUrl(this.router.url).root.children[
      PRIMARY_OUTLET
    ]?.segments;
    if (s && s[1].path && s[1].path.toLowerCase() === "arrivals") {
      this.useArrivals = true;
    }

    this.setupMarqueeScroller();

    this.route.paramMap.subscribe((routeParams) => {
      this.route.queryParamMap.subscribe((queryParamMap) => {
        this.boardParams = this.boardParametersService.parseParameters(
          routeParams,
          queryParamMap
        );

        console.log(this.boardParams);

        if (localStorage.getItem("settings_singleboard_showStationName") && this.boardParams.showStationName === false) {
          this.boardParams.showStationName =
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

        this.setupPageTitle();

        ToggleConfig.LoadingBar.next(true);
        this.getDepartures();
      })
    })

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.refresher);
      }
    });

    this.refresher = setInterval(() => this.getDepartures(), 16000);
  }

  getDepartures() {
    if (
      this.boardParams?.stationCode == null ||
      this.boardParams?.stationCode == ""
    ) {
      return;
    }
    this.googleAnalyticsEventsService.emitEvent(
      "GetSingleBoardDepartures",
      this.boardParams.stationCode,
      this.useArrivals
        ? "GetLatestArrivalsSingleBoard"
        : "GetLatestDepaturesSingleBoard"
    );
    this.departureService
      .GetSingleboardDepartures(
        this.boardParams.stationCode,
        this.useArrivals,
        this.boardParams.platform
      )
      .subscribe(
        (response) => {
          ToggleConfig.LoadingBar.next(false);
          this.processDepartures(response);
        },
        () => ToggleConfig.LoadingBar.next(false)
      );
  }

  processDepartures(data: SingleBoardResponse) {
    this.nextDepartures = [];

    if (!data || data.departures.length === 0) {
      return;
    }

    if (data.information !== this.information) {
      this.information = data.information;
      this.marquee.clear();
      const $item = document.createElement("div");
      $item.textContent = this.information;
      this.marquee.appendItem($item);
    }

    data.departures = data.departures.map((d) => ({
      ...d,
      status: this.calculateStatusField(d),
    }));

    this.firstRow = data.departures[0];
    this.nextDepartures = data.departures.slice(1, data.departures.length);
  }

  calculateStatusField(departure: Departure): string {
    if (departure.status === ServiceStatus.LATE) {
      const fexpected = departure.expectedDeparture;
      return "Exp " + this.datePipe.transform(fexpected, "HH:mm");
    } else {
      let status = this.toTitleCase(ServiceStatus[departure.status]);
      if (status === "Ontime") {
        status = "On Time";
      }

      return status.toString();
    }
  }

  setupPageTitle(){
    if(this.changeTitle === true){
      document.title =
      this.boardParams.stationCode +
      (this.useArrivals ? " - Arrivals" : " - Departures") +
      " - Departure Board";
    }


    this.stationLookupService
      .GetStationNameFromCode(this.boardParams.stationCode)
      .subscribe((name) => {
        if(this.changeTitle === true){
          document.title =
          name +
          (this.useArrivals ? " - Arrivals" : " - Departures") +
          " - Departure Board";
        }

        this.stationName = name;
        if (this.boardParams.platform) {
          this.stationName = `${name} (Platform ${this.boardParams.platform})`;
        }
      });
  }

  setupMarqueeScroller(): void {
    let scrollSpeed =
      localStorage.getItem("settings_singleboard_scrollspeed") ?? 300;

    this.marquee = new Marquee(
      document.getElementById("singleboard-information"),
      {
        rate: -scrollSpeed,
      }
    );

    this.marquee.onAllItemsRemoved(() => {
      const $item = document.createElement("div");
      $item.textContent = this.information;
      this.marquee?.appendItem($item);
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.refresher);
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
