import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.styling.css']
})
export class BoardComponent {
  private headers = new HttpHeaders().set('Content-Type', "application/json");

  constructor(private http: HttpClient) {
    this.http.post<object[]>("/api/LiveDepartures/GetLatestDepatures", null, { headers: this.headers });
  }
}
