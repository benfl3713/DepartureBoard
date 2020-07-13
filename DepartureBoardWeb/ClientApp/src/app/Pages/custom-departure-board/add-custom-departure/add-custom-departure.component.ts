import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Ajv from 'ajv'
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/Services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from "angular-notifier";
import { ToggleConfig } from 'src/app/ToggleConfig';
import { GoogleAnalyticsEventsService } from 'src/app/Services/google.analytics';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-custom-departure',
  templateUrl: './add-custom-departure.component.html',
  styleUrls: ['./add-custom-departure.component.css']
})
export class AddCustomDepartureComponent implements OnInit {

  isEdit:boolean = false;
  oldId: string;
  title: string = "";
  oldFileHref

  constructor(private afs: AngularFirestore, public auth: AuthService, private router: Router, private notifierService: NotifierService, private route: ActivatedRoute, public googleAnalyticsEventsService: GoogleAnalyticsEventsService, private sanitizer: DomSanitizer) {
    route.params.subscribe(() => {
      var id = this.route.snapshot.paramMap.get('id');
      if(id){
        ToggleConfig.LoadingBar.next(true)
        this.auth.user$.subscribe(user => {
          if(!user){
            this.notifierService.notify("error", "You must be logged in to use this")
            return;
          }
          this.afs.collection(`customDepartures/${user.uid}/departures`).doc(id).get().subscribe(result => {
          if(result.data()){
            this.isEdit = true;
            this.oldId = id;
            this.addForm.controls["name"].setValue(id);
            this.addForm.controls["hideExpired"].setValue(result.data().hideExpired);
            var theJSON = JSON.stringify(result.data().jsonData);
            var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
            this.oldFileHref = uri;
            document.title = "Edit Custom Departure - Departure Board"; 
            this.title = "Edit Custom Departures"
            ToggleConfig.LoadingBar.next(false);
          }
          else{
            this.router.navigate(["custom-departures"]);
          }
        }, () => ToggleConfig.LoadingBar.next(false))});
      }
      else{
        document.title = "Add Custom Departure - Departure Board"; 
          this.title = "Add Custom Departures";
      }
    }
    );
  }

  ngOnInit() {
  }
  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    hideExpired: new FormControl(true, [Validators.required]),
  });
  file:any;

  Save(){
    //#region Validation
    if(!this.file){
      alert("Please choose a file");
      return;
    }
    if(!this.addForm.controls["name"].value || !this.addForm.controls["name"].valid){
      alert("Name is required");
      return;
    }
   //#endregion

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      if(!this.ProcessFile(fileReader.result)){return;}
    }
    fileReader.readAsText(this.file);
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  ProcessFile(result):boolean {
    try{
      var jsonModel = JSON.parse(<string>result);
      var ajv = new Ajv({schemaId: 'auto'});
      var validate = ajv.compile(require('./departure.schema.json'));
      var valid = validate(jsonModel);
      if(valid == false){
        this.notifierService.notify("error", "File is not valid. Please check format");
        this.googleAnalyticsEventsService.emitEvent("CustomDepartures", "InvalidFile");
        return;
      }
      
      console.log("File is Schema Valid");
      this.notifierService.notify("default", "File is Schema Valid");

      var data = {
        createdDate: new Date(),
        departuresCount: jsonModel["departures"].length,
        hideExpired: this.addForm.controls["hideExpired"].value,
        jsonData: jsonModel
      };
      this.auth.user$.subscribe(user => {
        if(!user){
          this.notifierService.notify("error", "You must be logged in to save");
          return;
        }
        if(this.isEdit && this.oldId != this.addForm.controls["name"].value){
          this.afs.collection(`customDepartures/${user.uid}/departures`).doc(this.oldId).delete().then(() => {
            this.SaveToFirebase(user, data);
          });
        }
        else{
          this.SaveToFirebase(user, data);
        }
      });

      return true;
    }
    catch(e) {
      console.log(e);
      return false;
    }
  }
  SaveToFirebase(user, data){
    this.afs.collection(`customDepartures/${user.uid}/departures`).doc(this.addForm.controls["name"].value).set(data, this.isEdit == true ? { merge: true } : undefined);
    this.notifierService.notify("success", "Saved Successfully");
    this.googleAnalyticsEventsService.emitEvent("CustomDepartures", "Saved");
    this.router.navigate(["custom-departures"]);
}
}
