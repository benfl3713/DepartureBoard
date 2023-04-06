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
  constructor(private datePipe: DatePipe, private decimalPipe: DecimalPipe, private stationLookupService: StationLookupService) {
    this.vox = new Speech(this.datePipe, this.decimalPipe);
  }

  skippedArrivals = [];
  readonly vox: Speech;

  AnnounceArrivals(data, previousData?) {
    if (localStorage.getItem("settings_announcements_arrivals") !== "true"){
      return;
    }

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

  startPeriodicAnnouncement() {
    const inters = [];
    const timeouts = [];

    let cctvInterval = localStorage.getItem("settings_announcements_cctv_interval") ? +localStorage.getItem("settings_announcements_cctv_interval") : 20
    cctvInterval = cctvInterval * 60 * 1000

    let seeItInterval = localStorage.getItem("settings_announcements_seeItSayItSortIt_interval") ? +localStorage.getItem("settings_announcements_seeItSayItSortIt_interval") : 20
    seeItInterval = seeItInterval * 60 * 1000

    let smokingInterval = localStorage.getItem("settings_announcements_smoking_interval") ? +localStorage.getItem("settings_announcements_smoking_interval") : 20
    smokingInterval = smokingInterval * 60 * 1000

    if (localStorage.getItem("settings_announcements_cctv") == "true") {
      inters.push(setInterval(() => {
        this.vox.playText(["phraseset.notices.4.2"])
      }, cctvInterval));
    }

    if (localStorage.getItem("settings_announcements_seeItSayItSortIt") == "true") {
      timeouts.push(setTimeout(() => {
        inters.push(setInterval(() => {
          this.vox.playText(["phraseset.notices.9.2"])
        }, seeItInterval))
      }, 300000))
    }

    if (localStorage.getItem("settings_announcements_smoking") == "true") {
      timeouts.push(setTimeout(() => {
        inters.push(setInterval(() => {
          this.vox.playText(['phrase.attention_please.0', 0.65, 'phraseset.notices.3.0'])
        }, smokingInterval))
      }, 600000))
    }

    return () => {
      inters.forEach(i => clearInterval(i));
      timeouts.forEach(t => clearTimeout(t));
    }
  }

  private async Announce(data: Departure) {
    while (this.vox.isSpeaking) {

    }
    console.log("speak");
    data.stationCode = await this.stationLookupService.GetStationCodeFromName(data.destination).toPromise();
    this.vox.speak(data, {});
  }
}
