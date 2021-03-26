import {
  Component,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnDestroy,
} from "@angular/core";
import {
  ActivatedRoute,
  PRIMARY_OUTLET,
  UrlSegment,
  Router,
  NavigationStart,
} from "@angular/router";
import { Board } from "./board/board";
import { ToggleConfig } from "../../ToggleConfig";
import { GoogleAnalyticsEventsService } from "../../Services/google.analytics";
import { AuthService } from "src/app/Services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { DepartureService } from "src/app/Services/departure.service";
import { StationLookupService } from "src/app/Services/station-lookup.service";
import { Departure } from "src/app/models/departure.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-boards",
  templateUrl: "./boards.component.html",
  styleUrls: ["./boards.styling.css"],
})
export class BoardsComponent implements OnDestroy {
  time = new Date();
  refresher;
  noBoardsDisplay: boolean = false;
  useArrivals: boolean = false;
  isCustomData: boolean = false;
  showClock: boolean = true;
  showStationName: boolean = false;
  stationName;
  previousData;
  public displays: number = 6;
  public platform: string;
  public stationCode: string = "EUS";
  @ViewChild("Boards", { read: ViewContainerRef, static: true })
  Boards: ViewContainerRef;
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private router: Router,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private auth: AuthService,
    private afs: AngularFirestore,
    private departureService: DepartureService,
    private stationLookupService: StationLookupService
  ) {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.route.params.subscribe(() => {
      this.route.queryParams.subscribe((queryParams) => {
        this.SetupDisplay(queryParams);
      });
    });

    // Stops refresher if there is a page change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.refresher);
      }
    });
  }

  SetupDisplay(queryParams) {
    const s: UrlSegment[] = this.router.parseUrl(this.router.url).root.children[
      PRIMARY_OUTLET
    ].segments;
    if (s[0].path && s[0].path.toLowerCase() == "arrivals") {
      this.useArrivals = true;
    }

    if (s[0].path && s[0].path.toLowerCase() == "custom-departures") {
      this.isCustomData = true;
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
    } else {
      this.displays = Number(
        localStorage.getItem("settings_mainboard_count") || 6
      );
    }

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
    document.title =
      this.stationCode.toUpperCase() +
      (this.useArrivals ? " - Arrivals" : " - Departures") +
      " - Departure Board";

    if (this.isCustomData == false) {
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
    }
    ToggleConfig.LoadingBar.next(true);

    if (!this.isCustomData) {
      this.GetDepartures();
      this.refresher = setInterval(() => this.GetDepartures(), 16000);
    } else {
      this.GetCustomData();
    }
  }

  GetDepartures() {
    if (this.stationCode == null || this.stationCode == "") {
      return;
    }

    this.departureService
      .GetDepartures(
        this.stationCode,
        this.displays,
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

  ProcessDepartures(data: Departure[]) {
    if (
      !this.isCustomData &&
      this.previousData &&
      this.arraysAreEqual(data, this.previousData)
    ) {
      this.previousData = data;
      this.googleAnalyticsEventsService.emitEvent(
        "GetDepartures",
        this.stationCode.toUpperCase(),
        this.useArrivals ? "GetLatestArrivals" : "GetLatestDepatures",
        0
      );
      return;
    }
    this.googleAnalyticsEventsService.emitEvent(
      "GetDepartures",
      this.stationCode.toUpperCase(),
      this.useArrivals ? "GetLatestArrivals" : "GetLatestDepatures",
      1
    );
    this.Boards.clear();
    this.noBoardsDisplay = data.length === 0;

    for (let i = 0; i < data.length; i += 1) {
      try {
        const factory = this.resolver.resolveComponentFactory(Board);
        const componentRef = this.Boards.createComponent(factory);
        componentRef.instance.Initilize(data[i]);
      } catch (e) {
        console.log(e);
      }
    }
    this.previousData = data;
  }

  GetCustomData() {
    this.subscriptions.push(
      this.auth.user$.subscribe((user) => {
        this.subscriptions.push(
          this.afs
            .collection(`customDepartures/${user.uid}/departures`)
            .doc(this.stationCode)
            .valueChanges()
            .subscribe(
              (departureData: any) => {
                ToggleConfig.LoadingBar.next(false);
                console.debug(departureData);
                const data = departureData.jsonData;
                this.noBoardsDisplay = !data;
                this.stationName = data.stationName;
                document.title =
                  (data.stationName || this.stationCode) +
                  " - Departures - Departure Board";

                const departures: any[] = data.departures;
                let validDepartures: any[] = new Array();
                // Removes expired departures
                if (departureData.hideExpired == true || false) {
                  for (let i = 0; i < departures.length; i++) {
                    if (
                      Object(departures)[i]["expectedDeparture"] &&
                      new Date(Object(departures)[i]["expectedDeparture"]) <
                        new Date()
                    ) {
                      console.log(
                        `Departure has already gone past date ${
                          Object(departures)[i]["expectedDeparture"]
                        } - ${<string>Object(departures)[i]["destination"]}`
                      );
                    } else if (
                      Object(departures)[i]["aimedDeparture"] &&
                      new Date(Object(departures)[i]["aimedDeparture"]) <
                        new Date()
                    ) {
                      console.log(
                        `Departure has already gone past date ${
                          Object(departures)[i]["aimedDeparture"]
                        } - ${<string>Object(departures)[i]["destination"]}`
                      );
                    } else {
                      validDepartures.push(departures[i]);
                    }
                  }
                } else {
                  validDepartures = departures;
                }

                this.ProcessDepartures(validDepartures.slice(0, this.displays));
              },
              (error) => {
                ToggleConfig.LoadingBar.next(false);
                console.log(error);
              }
            )
        );
      })
    );
  }

  arraysAreEqual(x, y): boolean {
    try {
      let objectsAreSame = true;
      for (const propertyName in x) {
        if (!this.areDeparturesEqual(x[propertyName], y[propertyName])) {
          objectsAreSame = false;
          break;
        }
      }
      return objectsAreSame;
    } catch {
      return false;
    }
  }

  areDeparturesEqual(x, y) {
    try {
      let objectsAreSame = true;
      for (const propertyName in x) {
        if (propertyName == "lastUpdated") {
          continue;
        }
        if (propertyName == "stops") {
          if (this.arraysAreEqual(x[propertyName], y[propertyName])) {
            continue;
          }
        }
        if (x[propertyName] !== y[propertyName]) {
          objectsAreSame = false;
          break;
        }
      }
      return objectsAreSame;
    } catch {
      return false;
    }
  }

  ngOnDestroy() {
    clearTimeout(this.refresher);
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  isNumber(value: string | number): boolean {
    return value != null && !isNaN(Number(value.toString()));
  }
}
