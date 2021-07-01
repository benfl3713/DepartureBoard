import { Injectable } from "@angular/core";
import { ParamMap } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class BoardParametersService {
  constructor() {}

  parseParameters(routeParams: ParamMap, queryParams: ParamMap): BoardParams {
    const stationCode = routeParams.get("station");
    const platform = queryParams.get("platform") ?? null;
    const hideClock =
      queryParams.get("hideClock")?.toLowerCase() === "true" ?? false;
    const showStationName =
      queryParams.get("showStationName")?.toLowerCase() === "true" ?? false;

    let displays = null;
    if (this.isNumber(routeParams.get("displays"))) {
      displays = Number(routeParams.get("displays"));
    } else {
      displays = Number(localStorage.getItem("settings_mainboard_count") || 6);
    }

    return {
      stationCode,
      platform,
      displays,
      showClock: !hideClock,
      showStationName,
    };
  }

  isNumber(value: string | number): boolean {
    return value != null && !isNaN(Number(value.toString()));
  }
}

export interface BoardParams {
  stationCode: string;
  platform: string;
  displays: number;
  showClock: boolean;
  showStationName: boolean;
}
