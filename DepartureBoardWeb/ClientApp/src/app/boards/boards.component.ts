import { Component, ViewChild, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Board } from './board/board';
import { ServiceStatus } from '../singleboard/singleboard'

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.styling.css']
})
export class BoardsComponent {
  private headers = new HttpHeaders().set('Content-Type', "application/json");
  time = new Date();
  public displays: number = 6;
  public stationCode: string = "COV";
  @ViewChild('Boards', { read: ViewContainerRef }) Boards: ViewContainerRef;
  private boardsRefs: Array<ComponentRef<Board>> = new Array<ComponentRef<Board>>();

  constructor(private http: HttpClient, private route: ActivatedRoute, private datePipe: DatePipe, private resolver: ComponentFactoryResolver) {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    route.params.subscribe(() => {
      this.stationCode = this.route.snapshot.paramMap.get('station').toUpperCase();
      if (this.isNumber(this.route.snapshot.paramMap.get('displays'))) {
        this.displays = Number(this.route.snapshot.paramMap.get('displays'));
      }
      document.title = "Departure Board - " + this.stationCode;
      this.GetDepartures();
      setInterval(() => this.GetDepartures(), 16000);
    });
  }

  GetDepartures() {
    if (this.stationCode == null || this.stationCode == "") {
      return;
    }
    const formData = new FormData();
    formData.append("stationCode", this.stationCode);
    formData.append("amount", this.displays.toString());

    this.http.post<object[]>("/api/LiveDepartures/GetLatestDepatures", formData).subscribe(response => {
      this.ProcessDepartures(response);
    });
  }

  ProcessDepartures(data: object[]) {
    this.Boards.clear();
    for (var i = 0; i < data.length; i += 1) {
      const factory = this.resolver.resolveComponentFactory(Board);
      const componentRef = this.Boards.createComponent(factory);
      componentRef.instance.DepartureTime = <Date>Object(data)[i]["aimedDeparture"];
      componentRef.instance.Platform = <number>Object(data)[i]["platform"];
      componentRef.instance.Destination = <string>Object(data)[i]["destination"];
      componentRef.instance.Operator = <string>Object(data)[i]["operatorName"];
      var tempfirststatus = ServiceStatus[this.getEnumKeyByEnumValue(ServiceStatus, Object(data)[i]["status"])]
      if (tempfirststatus == ServiceStatus.LATE) {
        var fexpected = new Date(Date.parse(Object(data)[i]["expectedDeparture"]));
        componentRef.instance.Status = "EXP " + this.datePipe.transform(fexpected, 'HH:mm');
      }
      else {
        componentRef.instance.Status = ServiceStatus[tempfirststatus];
      }

      componentRef.instance.ProcessStops(Object(data)[i]["stops"]);
    }
  }

  getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
  }

  isNumber(value: string | number): boolean {
    return ((value != null) && !isNaN(Number(value.toString())));
  }
}
