import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LondonTubeService {

  constructor(private http: HttpClient) {}

  getDepartures(stopCode: string, count: number = 4): Observable<object[]> {
    const url = "/api/TubeDepartures";

    let params = new HttpParams().append("code", stopCode);
    params = params.append("count", count.toString());

    return this.http.get<object[]>(environment.apiBaseUrl + url, {
      params: params,
    });
  }
}
