import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Departure } from "../models/departure.model";
import { SingleBoardResponse } from "../models/singleboard-response.model";

@Injectable({
  providedIn: "root",
})
export class DepartureService {
  private jsonHeaders = new HttpHeaders().set(
    "Content-Type",
    "application/json"
  );

  constructor(private http: HttpClient) {}

  GetDepartures(
    stationCode: string,
    displays: number,
    useArrivals: boolean,
    platform: string = null,
    dataSource: string = null
  ): Observable<Departure[]> {
    const formData = new FormData();
    formData.append("stationCode", stationCode.toUpperCase());
    formData.append("amount", displays.toString());
    var url =
      "/api/LiveDepartures/" +
      (useArrivals ? "GetLatestArrivals" : "GetLatestDepatures");

    if (platform) {
      url = url + "?platform=" + platform;
    }

    if (!dataSource) {
      dataSource = localStorage.getItem("settings_general_dataSource");
    }
    var params;
    if (dataSource) {
      params = new HttpParams().set("dataSource", dataSource);
    }

    return this.http.post<Departure[]>(url, formData, { params: params });
  }

  GetSingleboardDepartures(
    stationCode: string,
    useArrivals: boolean,
    platform: string = null
  ): Observable<SingleBoardResponse> {
    let url =
      "/api/LiveDepartures/" +
      (useArrivals
        ? "GetLatestArrivalsSingleBoard"
        : "GetLatestDepaturesSingleBoard");
    if (platform) {
      url = url + "?platform=" + platform;
    }

    const dataSource = localStorage.getItem("settings_general_dataSource");
    let params;
    if (dataSource) {
      params = new HttpParams().set("dataSource", dataSource);
    }

    return this.http.post<SingleBoardResponse>(
      url,
      JSON.stringify(stationCode),
      {
        headers: this.jsonHeaders,
        params: params,
      }
    );
  }
}
