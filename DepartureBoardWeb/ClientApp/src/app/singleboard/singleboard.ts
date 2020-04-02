import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToggleConfig } from '../ToggleConfig';

@Component({
  selector: 'app-singleboard',
  templateUrl: './singleboard.html',
  styleUrls: ['./singleboard.styling.css']
})
export class SingleBoard {
  private headers = new HttpHeaders().set('Content-Type', "application/json");
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private datePipe: DatePipe, private router: Router) {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

	  route.params.subscribe(() => {
		  route.queryParams.subscribe(queryParams => {
			  this.stationCode = this.route.snapshot.paramMap.get('station');
			  if (queryParams['platform'] && this.isNumber(queryParams['platform'])) {
				  this.platform = queryParams['platform'];
			  }
        else { this.platform = null }
        document.title = this.stationCode + " - Departure Board";
        ToggleConfig.LoadingBar.next(true);
        this.http.get("/api/StationLookup/GetStationNameFromCode?code=" + this.stationCode).subscribe(name => document.title = name + " - Departure Board");
			  this.GetDepartures();
			  setInterval(() => this.GetDepartures(), 10000);
		  })});
  }
	stationCode: string;
	platform: number;
  time = new Date();
  noBoardsDisplay: boolean = false;

  //first
  firstTime: Date;
  firstPlatform: number;
  firstDestination: string;
  firstStatus: string = "";

  information: string;
  //second
  secondTime: Date;
  secondPlatform: number;
  secondDestination: string;
  secondStatus: string = "";

  GetDepartures() {
    if (this.stationCode == null || this.stationCode == "") {
      return;
	  }
	  var url = "/api/LiveDepartures/GetLatestDepaturesSingleBoard";
	  if (this.platform) {
		  url = url + "?platform=" + this.platform;
    }
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
    }

    //first
    this.firstTime = <Date>Object(data)["departures"][0]["aimedDeparture"];
    this.firstPlatform = <number>Object(data)["departures"][0]["platform"];
    this.firstDestination = <string>Object(data)["departures"][0]["destination"];
    var tempfirststatus = ServiceStatus[this.getEnumKeyByEnumValue(ServiceStatus, Object(data)["departures"][0]["status"])]
    if (tempfirststatus == ServiceStatus.LATE) {
      var fexpected = new Date(Date.parse(Object(data)["departures"][0]["expectedDeparture"]));
      this.firstStatus = "EXP " + this.datePipe.transform(fexpected, 'HH:mm');
    }
    else {
      this.firstStatus = ServiceStatus[tempfirststatus];
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
      this.secondStatus = "EXP " + this.datePipe.transform(sexpected, 'HH:mm');
    }
    else {
      this.secondStatus = ServiceStatus[tempsecondstatus];;
    }
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
      if (s) {
        this.router.navigate(["singleboard/",s])
      }
    });
  }
}

export enum ServiceStatus {
  ONTIME,
  LATE,
  CANCELLED,
  ARRIVED
}
