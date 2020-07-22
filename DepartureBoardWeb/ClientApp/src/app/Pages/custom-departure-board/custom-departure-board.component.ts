import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/Services/auth.service";
import { NotifierService } from "angular-notifier";
import { ToggleConfig } from "src/app/ToggleConfig";

@Component({
  selector: "app-custom-departure-board",
  templateUrl: "./custom-departure-board.component.html",
  styleUrls: ["./custom-departure-board.component.css"],
})
export class CustomDepartureBoardComponent implements OnInit {
  departureFiles;
  constructor(
    private afs: AngularFirestore,
    public auth: AuthService,
    private notifierService: NotifierService
  ) {
    document.title = "Custom Departures - Departure Board";
    ToggleConfig.LoadingBar.next(true);
  }

  ngOnInit() {
    this.auth.user$.subscribe(
      (user) => {
        if (!user) {
          this.notifierService.notify(
            "error",
            "You must be logged in to use this"
          );
          ToggleConfig.LoadingBar.next(false);
          return;
        }
        this.afs
          .collection(`customDepartures/${user.uid}/departures`)
          .get()
          .subscribe(
            (departures) => (this.departureFiles = departures.docs),
            (error) => console.log(error),
            () => ToggleConfig.LoadingBar.next(false)
          );
      },
      (error) => {
        console.log(error);
        ToggleConfig.LoadingBar.next(false);
      }
    );
  }

  deleteDeparture(id: string) {
    this.auth.user$.subscribe((user) => {
      this.afs
        .collection(`customDepartures/${user.uid}/departures`)
        .doc(id)
        .delete()
        .then(() => {
          this.notifierService.notify("success", "Deleted Successfully");
          this.ngOnInit();
        });
    });
  }
}
