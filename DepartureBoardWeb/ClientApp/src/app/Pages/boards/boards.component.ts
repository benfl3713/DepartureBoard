import {
  Component,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnDestroy,
  OnInit,
  Input, HostListener,
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
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { DepartureService } from "src/app/Services/departure.service";
import { StationLookupService } from "src/app/Services/station-lookup.service";
import { Departure } from "src/app/models/departure.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {ServiceStatus} from "../singleboard/singleboard";
import { AnnouncementService } from "src/app/Services/announcement.service";
import {BoardModernRgb} from "./board-modern-rgb/board-modern-rgb";
import {ConfigService} from "../../Services/config.service";

@Component({
  selector: "app-boards",
  templateUrl: "./boards.component.html",
  styleUrls: ["./boards.styling.css"],
})
export class BoardsComponent implements OnInit, OnDestroy {
  time = new Date();
  refresher;
  noBoardsDisplay: boolean = false;
  useModernBoard: boolean = false;
  useArrivals: boolean = false;
  isCustomData: boolean = false;
  showClock: boolean = true;
  showStationName: boolean = false;
  stationName;
  toCrsCode;
  previousData;
  @Input() public displays: number = 6;
  public platform: string;
  @Input() public stationCode: string = "EUS";
  @ViewChild("Boards", { read: ViewContainerRef, static: true })
  Boards: ViewContainerRef;
  subscriptions: Subscription[] = [];
  isLoading = false;
  announcementSub;
  customDepartureSequence: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private router: Router,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private auth: AuthService,
    private afs: AngularFirestore,
    private departureService: DepartureService,
    private stationLookupService: StationLookupService,
    private announcement: AnnouncementService,
    private configService: ConfigService
  ) {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  ngOnInit() {
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

    this.announcementSub = this.announcement.startPeriodicAnnouncement();
  }

  SetupDisplay(queryParams) {
    const s: UrlSegment[] = this.router.parseUrl(this.router.url).root.children[
      PRIMARY_OUTLET
    ]?.segments;
    if (s && s[0].path && s[0].path.toLowerCase() == "arrivals") {
      this.useArrivals = true;
    }

    if (s && s[0].path && s[0].path.toLowerCase() == "custom-departures") {
      this.isCustomData = true;
    }

    if (s && s[0].path && s[0].path.toLowerCase() == "modern") {
      this.useModernBoard = true;
      if (s && s[1].path && s[1].path.toLowerCase() == "arrivals") {
        this.useArrivals = true;
      }
    }

    this.stationCode = this.route.snapshot.paramMap.get("station") ?? this.stationCode;
    this.toCrsCode = this.route.snapshot.paramMap.get("toCrsCode");

    if (this.configService.getItem("settings_mainboard_showStationName")) {
      this.showStationName =
        this.configService
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
        this.configService.getItem("settings_mainboard_count") || this.displays
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
    this.isLoading = true

    if (!this.isCustomData) {
      this.GetDepartures();
      this.refresher = setInterval(() => this.GetDepartures(), 30000);
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
        this.platform,
        null,
        this.toCrsCode
      )
      .subscribe(
        (response) => {
          ToggleConfig.LoadingBar.next(false);
          this.isLoading = false;
          this.ProcessDepartures(response);
        },
        () => {
          ToggleConfig.LoadingBar.next(false);
          this.isLoading = false;
        }
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
        const factory = this.resolver.resolveComponentFactory(this.useModernBoard ? BoardModernRgb : Board);
        const componentRef = this.Boards.createComponent(factory);
        componentRef.instance.Initilize(data[i]);
      } catch (e) {
        console.log(e);
      }
    }

    this.announcement.AnnounceArrivals(data, this.previousData);
    this.previousData = data
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
                this.isLoading = false;
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

                this.subscriptions.push(this.customDepartureSequence.subscribe(startIndex => {
                  const index = departureData.manualControl ? startIndex : 0;
                  this.ProcessDepartures(validDepartures.slice(index, this.displays));
                }));
              },
              (error) => {
                ToggleConfig.LoadingBar.next(false);
                this.isLoading = false;
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
    this.announcementSub();
  }

  isNumber(value: string | number): boolean {
    return value != null && !isNaN(Number(value.toString()));
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log("Key Pressed")
    if(event.key == "ArrowRight"){
      this.customDepartureSequence.next(this.customDepartureSequence.value + 1);
    } else if(event.key == "ArrowLeft"){
      this.customDepartureSequence.next(this.customDepartureSequence.value -1);
    }
  }
}
