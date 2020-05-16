import { ServiceStatus } from "../Pages/singleboard/singleboard";

export interface Departure{
    StationName: string;
    Platform?: number;
    Destination: string;
    OperatorName?: string;
    DepartureDateTime: Date;
    Status: ServiceStatus;
    Stops: StationStop[];
}

export interface StationStop{
    StationName: string;
    DepartureDateTime: Date;
}