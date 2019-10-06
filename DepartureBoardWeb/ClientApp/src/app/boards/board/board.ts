import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceStatus } from '../../singleboard/singleboard'

@Component({
  selector: 'app-board',
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board{
  private headers = new HttpHeaders().set('Content-Type', "application/json");

  constructor(private http: HttpClient) {
    setInterval(() => this.Pager(), 8000);
  }

  public DepartureTime: Date;
  public Platform: number;
  public Destination: string;
  public Stops: Array<Stop> = new Array<Stop>();
  public DisplayedStops: Array<Stop> = new Array<Stop>();
  public Status: string;
  public Operator: string;

  private CurrentPage: number = 0;
  private TotalPages: number = 0;

  Pager() {
    if (this.CurrentPage != this.TotalPages) {
      this.CurrentPage++;
    }
    else {
      this.CurrentPage = 1;
    }
    const start = (this.CurrentPage - 1) * 9;
    this.DisplayedStops = this.Stops.slice(start, start+9);
  }

  public ProcessStops(data) {
    for (var i = 0; i < data.length; i += 1) {
      this.Stops.push(new Stop(<string>Object(data)[i]["stationName"], <Date>Object(data)[i]["aimedDeparture"]));
    }
    this.TotalPages = Math.ceil(this.Stops.length / 9);
    this.Pager();
  }
}
export class Stop {
  public StationName: string;
  public Time: Date;
  constructor(name: string, time: Date) {
    this.StationName = name
    this.Time = time;
  }
}
