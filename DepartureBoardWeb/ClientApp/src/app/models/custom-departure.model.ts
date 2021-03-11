import { Interface } from "readline";
import { Departure } from "./departure.model";

export interface CustomDeparture {
  departures: Departure[];
  stationName: string;
}
