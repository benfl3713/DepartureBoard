import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, Params, PRIMARY_OUTLET, UrlSegment, NavigationStart } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToggleConfig } from '../../ToggleConfig';
import { GoogleAnalyticsEventsService } from '../../Services/google.analytics';
import { Marquee } from 'dynamic-marquee';

@Component({
  selector: 'app-singleboard',
  templateUrl: './singleboard.html',
  styleUrls: ['./singleboard.styling.css']
})
export class SingleBoard implements OnDestroy, OnInit {
  private headers = new HttpHeaders().set('Content-Type', "application/json");
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private datePipe: DatePipe, private router: Router, public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    const s: UrlSegment[] = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments;
    if (s[1].path && s[1].path.toLowerCase() == "arrivals") {
      this.useArrivals = true;
    }

	  route.params.subscribe(() => {
		  route.queryParams.subscribe(queryParams => {
			  this.stationCode = this.route.snapshot.paramMap.get('station');
			  if (queryParams['platform'] && this.isNumber(queryParams['platform'])) {
				  this.platform = queryParams['platform'];
			  }
        else { this.platform = null }

        if (queryParams['hideClock'] && (<string>queryParams['hideClock']).toLowerCase() === 'true') {
          this.showClock = false;
        }

        ToggleConfig.LoadingBar.next(true);
        document.title = this.stationCode + (this.useArrivals ? " - Arrivals" : " - Departures") + " - Departure Board";
        this.http.get("/api/StationLookup/GetStationNameFromCode?code=" + this.stationCode).subscribe(name => document.title = name + (this.useArrivals ? " - Arrivals" : " - Departures") + " - Departure Board");
			  this.GetDepartures();
			  this.refresher = setInterval(() => this.GetDepartures(), 10000);
      })
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.refresher);
      }
    });
  }
    ngOnInit(): void {
      this.marquee = new Marquee(document.getElementById('singleboard-information'), {
        rate: -300
      });

      this.marquee.onAllItemsRemoved(() => {
        const $item = document.createElement('div');
        $item.textContent = this.information;
        this.marquee.appendItem($item)
      });
    }
	stationCode: string;
	platform: number;
  time = new Date();
  refresher;
  noBoardsDisplay: boolean = false;
  showClock:boolean = true;
  useArrivals: boolean = false;

  //first
  firstTime: Date;
  firstPlatform: number;
  firstDestination: string;
  firstStatus: string = "";

  information: string;
  marquee;
  //second
  secondTime: Date;
  secondPlatform: number;
  secondDestination: string;
  secondStatus: string = "";

  GetDepartures() {
    if (this.stationCode == null || this.stationCode == "") {
      return;
    }
    var url = "/api/LiveDepartures/" + (this.useArrivals ? "GetLatestArrivalsSingleBoard" : "GetLatestDepaturesSingleBoard");
	  if (this.platform) {
		  url = url + "?platform=" + this.platform;
    }
    this.googleAnalyticsEventsService.emitEvent("GetSingleBoardDepartures", this.stationCode, (this.useArrivals ? "GetLatestArrivalsSingleBoard" : "GetLatestDepaturesSingleBoard"));
    this.http.post<object[]>(url, JSON.stringify(this.stationCode), { headers: this.headers }).subscribe(response => {
      ToggleConfig.LoadingBar.next(false)
      this.ProcessDepartures(response);
    }, () => ToggleConfig.LoadingBar.next(false));
  }

  ProcessDepartures(data) {
    this.noBoardsDisplay = Object(data)["departures"].length === 0;
    var tempinfo = <string>Object(data)["information"];
    if (tempinfo != this.information) {
      this.information = tempinfo;
      this.marquee.clear();
      const $item = document.createElement('div');
      $item.textContent = this.information;
      this.marquee.appendItem($item)
    }

    //first
    this.firstTime = <Date>Object(data)["departures"][0]["aimedDeparture"];
    this.firstPlatform = <number>Object(data)["departures"][0]["platform"];
    this.firstDestination = <string>Object(data)["departures"][0]["destination"];
    var tempfirststatus = ServiceStatus[this.getEnumKeyByEnumValue(ServiceStatus, Object(data)["departures"][0]["status"])]
    if (tempfirststatus == ServiceStatus.LATE) {
      var fexpected = new Date(Date.parse(Object(data)["departures"][0]["expectedDeparture"]));
      this.firstStatus = "Exp " + this.datePipe.transform(fexpected, 'HH:mm');
    }
    else {
      this.firstStatus = this.toTitleCase(ServiceStatus[tempfirststatus]);
      if (this.firstStatus == "Ontime") {
        this.firstStatus = "On Time";
      }
    }
    if (Object(data)["departures"][1] == null) {
      this.secondTime = null;
      this.secondPlatform = null;
      this.secondDestination = null;
      this.secondStatus = "";
      return;
    }
    //second
    this.secondTime = <Date>Object(data)["departures"][1]["aimedDeparture"];
    this.secondPlatform = <number>Object(data)["departures"][1]["platform"];
    this.secondDestination = <string>Object(data)["departures"][1]["destination"];
    var tempsecondstatus = ServiceStatus[this.getEnumKeyByEnumValue(ServiceStatus, Object(data)["departures"][1]["status"])]
    if (tempsecondstatus == ServiceStatus.LATE) {
      var sexpected = new Date(Date.parse(Object(data)["departures"][1]["expectedDeparture"]));
      this.secondStatus = "Exp " + this.datePipe.transform(sexpected, 'HH:mm');
    }
    else {
      this.secondStatus = this.toTitleCase(ServiceStatus[tempsecondstatus]);
      if (this.secondStatus == "Ontime") {
        this.secondStatus = "On Time";
      }
    }
  }

  ngOnDestroy() {
    clearTimeout(this.refresher);
  }

  getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
  }

	isNumber(value: string | number): boolean {
		return ((value != null) && !isNaN(Number(value.toString())));
  }

  FilterPlatform(platform: number) {
    if (platform) {
      const queryParams: Params = { platform };
      this.router.navigate(
        [],
        {
          queryParams: queryParams,
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
    }
  }

  ChangeStation(stationName: string) {
    this.http.get("/api/StationLookup/GetStationCodeFromName?name=" + stationName).subscribe(s => {
      if (this.useArrivals) {
        this.router.navigate(["singleboard/arrivals/", s])
      }
      else {
        this.router.navigate(["singleboard/", s])
      }
    });
  }

  toTitleCase(input:string):string{
    return input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  };
}

export enum ServiceStatus {
  ONTIME,
  LATE,
  CANCELLED,
  ARRIVED
}

