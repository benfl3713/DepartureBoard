import { Departure } from "./departure.model";

export interface SingleBoardResponse {
  departures: Departure[];
  information: string;
}
