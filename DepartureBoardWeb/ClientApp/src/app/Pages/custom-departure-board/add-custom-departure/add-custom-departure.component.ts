import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Ajv from "ajv";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "src/app/Services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ToggleConfig } from "src/app/ToggleConfig";
import { GoogleAnalyticsEventsService } from "src/app/Services/google.analytics";
import { DomSanitizer } from "@angular/platform-browser";
import { CustomDeparture } from "src/app/models/custom-departure.model";
import {NotifierService} from "../../../Services/notifier.service";

@Component({
  selector: "app-add-custom-departure",
  templateUrl: "./add-custom-departure.component.html",
  styleUrls: ["./add-custom-departure.component.css"],
})
export class AddCustomDepartureComponent {
  isEdit: boolean = false;
  oldId: string;
  title: string = "";
  oldFileHref;
  data: CustomDeparture;
  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    hideExpired: new FormControl(true, [Validators.required]),
    manualControl: new FormControl(false, [Validators.required]),
  });
  file: File;
  error = '';
  isValidData = true;

  constructor(
    private afs: AngularFirestore,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private sanitizer: DomSanitizer,
    private notifierService: NotifierService
  ) {
    route.params.subscribe(() => {
      var id = this.route.snapshot.paramMap.get("id");
      if (id) {
        ToggleConfig.LoadingBar.next(true);
        this.auth.user$.subscribe((user) => {
          if (!user) {
            this.notifierService.notify(
              "error",
              "You must be logged in to use this"
            );
            return;
          }
          this.afs
            .collection(`customDepartures/${user.uid}/departures`)
            .doc(id)
            .get()
            .subscribe(
              (result) => {
                if (result.data()) {
                  this.isEdit = true;
                  this.oldId = id;
                  this.addForm.controls["name"].setValue(id);
                  this.addForm.controls["hideExpired"].setValue(
                    result.data()["hideExpired"]
                  );
                  this.addForm.controls["manualControl"].setValue(
                    result.data()["manualControl"]
                  );
                  var theJSON = JSON.stringify(result.data()["jsonData"]);
                  this.data = result.data()["jsonData"];
                  var uri = this.sanitizer.bypassSecurityTrustUrl(
                    "data:text/json;charset=UTF-8," +
                      encodeURIComponent(theJSON)
                  );
                  this.oldFileHref = uri;
                  document.title = "Edit Custom Departure - Departure Board";
                  this.title = "Edit Custom Departures";
                  ToggleConfig.LoadingBar.next(false);
                  this.ValidateDataEvent();
                } else {
                  this.router.navigate(["custom-departures"]);
                }
              },
              () => ToggleConfig.LoadingBar.next(false)
            );
        });
      } else {
        document.title = "Add Custom Departure - Departure Board";
        this.title = "Add Custom Departures";
      }
    });
  }

  Save() {
    if (!this.data) {
      alert("Please add some data");
      return;
    }
    if (
      !this.addForm.controls["name"].value ||
      !this.addForm.controls["name"].valid
    ) {
      alert("Name is required");
      return;
    }

    this.ValidateAndSaveDepartures();
  }

  fileChanged(e) {
    this.file = e.target.files[0];
    if (this.file) {
      this.file.text().then((t) => (this.data = JSON.parse(t)));
    }
  }

  Validate(showError: boolean = true): boolean {
    console.log("Validate");
    var ajv = new Ajv();
    var validate = ajv.compile(require("./departure.schema.json"));
    var valid = validate(this.data);
    this.error = ajv.errorsText(validate.errors);
    if (valid == false) {
      if (showError == true) {
        this.notifierService.notify("error", "Cannot Save: Invalid Data");
        this.googleAnalyticsEventsService.emitEvent(
          "CustomDepartures",
          "InvalidFile"
        );
      }
      return false;
    }

    if (showError == true) {
      console.log("Schema is Valid");
    }

    return true;
  }

  ValidateDataEvent() {
    this.isValidData = this.Validate(false);
  }

  ValidateAndSaveDepartures(showError: boolean = true): boolean {
    try {
      if (this.Validate() == false) {
        return false;
      }

      const hideExpired = this.addForm.controls["hideExpired"].value;
      let manualControl = this.addForm.controls["manualControl"].value;

      if (hideExpired === true) {
        manualControl = false;
      }

      var toSaveForm = {
        createdDate: new Date(),
        departuresCount: this.data.departures.length,
        hideExpired: hideExpired,
        manualControl: manualControl,
        jsonData: this.data,
      };
      this.auth.user$.subscribe((user) => {
        if (!user) {
          this.notifierService.notify("error", "You must be logged in to save");
          return;
        }
        if (this.isEdit && this.oldId != this.addForm.controls["name"].value) {
          this.afs
            .collection(`customDepartures/${user.uid}/departures`)
            .doc(this.oldId)
            .delete()
            .then(() => {
              this.SaveToFirebase(user, toSaveForm);
            });
        } else {
          this.SaveToFirebase(user, toSaveForm);
        }
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  SaveToFirebase(user, data) {
    this.afs
      .collection(`customDepartures/${user.uid}/departures`)
      .doc(this.addForm.controls["name"].value)
      .set(data, this.isEdit == true ? { merge: true } : undefined);
    this.notifierService.notify("success", "Saved Successfully");
    this.googleAnalyticsEventsService.emitEvent("CustomDepartures", "Saved");
    this.router.navigate(["custom-departures"]);
  }
}
