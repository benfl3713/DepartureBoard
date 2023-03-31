import { DatePipe, DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Departure } from '../models/departure.model';
import { ServiceStatus } from '../Pages/singleboard/singleboard';
import { Speech } from '../RAG/Speech';
import { StationLookupService } from './station-lookup.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  constructor(private datePipe: DatePipe, private decimalPipe: DecimalPipe, private stationLookupService: StationLookupService) {}

  skippedArrivals = [];

  AnnounceArrivals(data, previousData?) {
    let hasSpoken = false;

    data.forEach(arrival => {
      if (this.HasJustArrived(arrival, previousData)){
        if (hasSpoken){
          this.skippedArrivals.push(this.getDepartureKey(arrival))
          return;
        }

        hasSpoken = true;
        this.Announce(arrival)
      }
    });
  }

  HasJustArrived(arrival: Departure, previousData?: Departure[]) {
    if (arrival.status != ServiceStatus.ARRIVED){
      return false;
    }

    const key = this.getDepartureKey(arrival);

    if (!this.skippedArrivals.includes(key) && previousData && previousData.find(f => this.getDepartureKey(f) == key && f.status == ServiceStatus.ARRIVED )){
      return false;
    }

    if (this.skippedArrivals.includes(key)){
      this.skippedArrivals.splice(this.skippedArrivals.indexOf(key), 1);
    }

    return true;
  }

  getDepartureKey(dep: Departure){
    return `${dep.destination}_${dep.aimedDeparture}_${dep.operatorName}`
  }



  private async Announce(data: Departure) {
    const vox = new Speech(this.datePipe, this.decimalPipe);
    console.log("speak");
    data.stationCode = await this.stationLookupService.GetStationCodeFromName(data.destination).toPromise();
    vox.speak(data, {});
  }
}
