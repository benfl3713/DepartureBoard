import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-singleboard',
  templateUrl: './singleboard.html',
  styleUrls: ['./singleboard.styling.css']
})
export class SingleBoard {
  private headers = new HttpHeaders().set('Content-Type', "application/json");
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private datePipe: DatePipe) {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    route.params.subscribe(() => {
      this.stationCode = this.route.snapshot.paramMap.get('station');
      this.GetDepartures();
      setInterval(() => this.GetDepartures(), 10000);
      });
  }
  stationCode: string;
  time = new Date();

  //first
  firstTime: Date;
  firstPlatform: number;
  firstDestination: string;
  firstStatus: string;

  information: string;
  //second
  secondTime: Date;
  secondPlatform: number;
  secondDestination: string;
  secondStatus: string;

  GetDepartures() {
    if (this.stationCode == null || this.stationCode == "") {
      return;
    }
    this.http.post<object[]>("/api/LiveDepartures/GetLatestDepaturesSingleBoard", JSON.stringify(this.stationCode), { headers: this.headers }).subscribe(response => {
      this.ProcessDepartures(response);
    });
  }

  ProcessDepartures(data){
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
      this.secondStatus = null;
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

}

export enum ServiceStatus {
  ONTIME,
  LATE,
  CANCELLED
}
