import { Component, HostListener, Input, OnDestroy, OnInit } from "@angular/core";
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
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "src/app/Services/auth.service";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {AnnouncementService} from "src/app/Services/announcement.service";
import {ConfigService} from "../../Services/config.service";

@Component({
  selector: "app-singleboard",
  templateUrl: "./singleboard.html",
  styleUrls: ["./singleboard.styling.css"],
})
export class SingleBoard implements OnDestroy, OnInit {
  @Input() stationCode: string;
  @Input() positionAbsolute: boolean = true;
  platform: string;
  toCrsCode: string;
  time = new Date();
  refresher;
  noBoardsDisplay: boolean = false;
  isCustomData: boolean = false;
  @Input() showClock: boolean = true;
  @Input() useArrivals: boolean = false;
  @Input() showStationName = false;
  @Input() changeTitle = true;
  stationName;
  nextDepartures: Departure[] = [];
  subscriptions: Subscription[] = [];
  announcementSub;
  customDepartureSequence: BehaviorSubject<number> = new BehaviorSubject(0);

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
    private stationLookupService: StationLookupService,
    private auth: AuthService,
    private afs: AngularFirestore,
    private announcement: AnnouncementService,
    private configService: ConfigService
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

    if (s && s[0].path && s[0].path.toLowerCase() == "custom-departures") {
      this.isCustomData = true;
    }

    if (this.configService.getItem("settings_singleboard_showStationName")) {
      this.showStationName =
        this.configService
          .getItem("settings_singleboard_showStationName")
          .toLowerCase() == "true";
    }

    if (this.configService.getItem("settings_singleboard_alternateSecondRow")) {
      this.alternateSecondRow =
        this.configService
          .getItem("settings_singleboard_alternateSecondRow")
          .toLowerCase() == "true";
    }

    this.route.params.subscribe(() => {
      this.route.queryParams.subscribe((queryParams) => {
        this.stationCode = this.route.snapshot.paramMap.get("station") ?? this.stationCode;
        this.toCrsCode = this.route.snapshot.paramMap.get("toCrsCode");

        if(!this.stationCode){
          return;
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

        if (queryParams["showStationName"]) {
          this.showStationName = queryParams["showStationName"] == "true";
        }

        let scrollSpeed =
          this.configService.getItem("settings_singleboard_scrollspeed") ?? 300;

        if (queryParams["scrollSpeed"]) {
          scrollSpeed = +queryParams["scrollSpeed"];
        }

        this.marquee = new Marquee(
          document.getElementById("singleboard-information"),
          {
            rate: -scrollSpeed,
          }
        );

        this.marquee.onAllItemsRemoved(() => {
          const $item = document.createElement("div");
          $item.textContent = this.information;
          this.marquee.appendItem($item);
        });

        ToggleConfig.LoadingBar.next(true);

        if(this.changeTitle === true){
          document.title =
          this.stationCode +
          (this.useArrivals ? " - Arrivals" : " - Departures") +
          " - Departure Board";
        }

        if (this.isCustomData == false) {
          this.stationLookupService
            .GetStationNameFromCode(this.stationCode)
            .subscribe((name) => {
              if(this.changeTitle === true){
                document.title =
                name +
                (this.useArrivals ? " - Arrivals" : " - Departures") +
                " - Departure Board";
              }

              this.stationName = name;
              if (this.platform) {
                this.stationName = `${name} (Platform ${this.platform})`;
              }
            });
        }

        if (!this.isCustomData) {
          this.GetDepartures();
          this.refresher = setInterval(() => this.GetDepartures(), 30000);
        } else {
          this.GetCustomData();
        }
      });
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.refresher);
      }
    });

    this.announcementSub = this.announcement.startPeriodicAnnouncement();
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
        this.platform,
        this.toCrsCode
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

    if (data.departures.length === 0) {
      this.firstTime = null;
      this.firstPlatform = "";
      this.firstDestination = "";
      this.firstStatus = "";
      return;
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
    this.subscriptions.forEach((s) => s.unsubscribe());
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

                this.subscriptions.push(this.customDepartureSequence.subscribe(startIndex => {
                  // Calculates the Departure Status's
                  validDepartures.map(d => {
                    if (d.expectedDeparture) {
                      d.status = new Date(d.expectedDeparture) > new Date(d.aimedDeparture)
                        ? ServiceStatus.LATE
                        : ServiceStatus.ONTIME;
                    }
                    else {
                      d.status = ServiceStatus.ONTIME;
                    }

                    return d;
                  });

                  var toViewDepartures = validDepartures.slice(departureData.manualControl ? startIndex : 0, 3);

                  let information = ""
                  if (toViewDepartures.length > 0){
                    information = this.GetInformationLine(toViewDepartures[0])
                  }

                  this.ProcessDepartures({
                    departures: toViewDepartures,
                    information: information
                  });
                }));
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

  GetInformationLine(departure: Departure) {
    let information = ""
    departure.stops.forEach(s => {
      if (information == "") information="Calling at "
      information += `${s.stationName} (${this.datePipe.transform(s.aimedDeparture, "HH:mm")})       `
    })

    return information
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

export enum ServiceStatus {
  ONTIME,
  LATE,
  CANCELLED,
  ARRIVED,
}
