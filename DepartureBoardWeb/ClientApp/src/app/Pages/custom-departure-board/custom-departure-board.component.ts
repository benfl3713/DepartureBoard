import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-custom-departure-board',
  templateUrl: './custom-departure-board.component.html',
  styleUrls: ['./custom-departure-board.component.css']
})
export class CustomDepartureBoardComponent implements OnInit {

  departureFiles;
  constructor(private afs: AngularFirestore, public auth: AuthService) { document.title = "Custom Departures - Departure Board";}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.afs.collection(`customDepartures/${user.uid}/departures`).get().subscribe(departures => this.departureFiles = departures.docs);
    });
  }

  deleteDeparture(id:string){
    this.auth.user$.subscribe(user => {
      this.afs.collection(`customDepartures/${user.uid}/departures`).doc(id).delete().then(() => this.ngOnInit());
    });
  }

}
