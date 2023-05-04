import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Departure } from "../models/departure.model";
import { SingleBoardResponse } from "../models/singleboard-response.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DepartureService {
  constructor(private http: HttpClient) {}

  GetDepartures(
    stationCode: string,
    displays: number,
    useArrivals: boolean,
    platform: string = null,
    dataSource: string = null,
    toCrsCode: string = null,
    includeStopData: boolean = null
  ): Observable<Departure[]> {
    const params: any = {
      stationCode,
      count: displays,
    };

    if (platform) {
      params.platform = platform;
    }
    if (!dataSource) {
      dataSource = localStorage.getItem("settings_general_dataSource");
    }
    if (dataSource) {
      params.dataSource = dataSource;
    }
    if (toCrsCode){
      params.toCrsCode = toCrsCode;
    }

    if (includeStopData) {
      params.includeStopData = includeStopData;
    }

    if (localStorage.getItem("settings_general_includeNonPassengerServices") === "true") {
      params.includeNonPassengerServices = true;
    }

    var url =
      environment.apiBaseUrl +
      "/api/LiveDepartures/" +
      (useArrivals ? "GetLatestArrivals" : "GetLatestDepatures");

    return this.http.get<Departure[]>(url, {
      params: params,
    });
  }

  GetSingleboardDepartures(
    stationCode: string,
    useArrivals: boolean,
    platform: string = null,
    toCrsCode: string = null
  ): Observable<SingleBoardResponse> {
    let url =
      environment.apiBaseUrl +
      "/api/LiveDepartures/" +
      (useArrivals
        ? "GetLatestArrivalsSingleBoard"
        : "GetLatestDepaturesSingleBoard");

    const params: any = {
      stationCode,
    };

    if (platform) {
      params.platform = platform;
    }

    const dataSource = localStorage.getItem("settings_general_dataSource");
    if (dataSource) {
      params.dataSource = dataSource;
    }

    if (localStorage.getItem("settings_general_includeNonPassengerServices") === "true") {
      params.includeNonPassengerServices = true;
    }

    if (toCrsCode) {
      params.toCrsCode = toCrsCode;
    }

    return this.http.get<SingleBoardResponse>(url, {
      params: params,
    });
  }
}
