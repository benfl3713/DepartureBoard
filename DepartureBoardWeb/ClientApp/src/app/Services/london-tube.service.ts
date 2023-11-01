import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LondonTubeService {

  constructor(private http: HttpClient) {}

  getDepartures(stopCode: string, count: number = 4, line?: string, direction?: string): Observable<object[]> {
    const url = "/api/TubeDepartures";

    let params = new HttpParams().append("code", stopCode);
    params = params.append("count", count.toString());

    if (line) {
      params = params.append("line", line);
    }

    if (direction) {
      params = params.append("direction", direction);
    }

    return this.http.get<object[]>(environment.apiBaseUrl + url, {
      params: params,
    });
  }

  search(query: string) {
    const url = "/api/TubeDepartures/search";

    let params = new HttpParams().append("query", query);

    return this.http.get<any[]>(environment.apiBaseUrl + url, {
      params: params,
    });
  }

  getStationInfo(stopCode: string): Observable<StationInfo> {
    return this.http.get<StationInfo>(environment.apiBaseUrl + `/api/TubeDepartures/station/${stopCode}`);
  }

}

export interface StationInfo {
  name: string;
  code: string;
}
