import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartureService {
  private jsonHeaders = new HttpHeaders().set('Content-Type', "application/json");

  constructor(private http:HttpClient) { }

  GetDepartures(stationCode:string, displays:number, useArrivals:boolean, platform:number = null):Observable<object[]>{
    const formData = new FormData();
    formData.append("stationCode", stationCode.toUpperCase());
    formData.append("amount", displays.toString());
    var url = "/api/LiveDepartures/" + (useArrivals ? "GetLatestArrivals" : "GetLatestDepatures");

	  if (platform) {
		  url = url + "?platform=" + platform;
    }
    
    return this.http.post<object[]>(url, formData)
  }

  GetSingleboardDepartures(stationCode:string, useArrivals:boolean, platform:number = null):Observable<object[]>{
    var url = "/api/LiveDepartures/" + (useArrivals ? "GetLatestArrivalsSingleBoard" : "GetLatestDepaturesSingleBoard");
	  if (platform) {
		  url = url + "?platform=" + platform;
    }
    
    return this.http.post<object[]>(url, JSON.stringify(stationCode), {headers: this.jsonHeaders})
  }
}
