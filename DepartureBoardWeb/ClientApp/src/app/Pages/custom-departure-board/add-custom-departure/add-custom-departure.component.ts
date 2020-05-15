import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Ajv from 'ajv'
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-custom-departure',
  templateUrl: './add-custom-departure.component.html',
  styleUrls: ['./add-custom-departure.component.css']
})
export class AddCustomDepartureComponent implements OnInit {

  constructor(private afs: AngularFirestore, public auth: AuthService, private router: Router) {document.title = "Add Custom Departure - Departure Board"; }

  ngOnInit() {
  }
  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required])
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
      console.log("File is Schema Valid");

      var data = {
        createdDate: new Date(),
        departuresCount: jsonModel["departures"].length,
        jsonData: jsonModel
      };
      this.auth.user$.subscribe(user => {
        this.afs.collection(`customDepartures/${user.uid}/departures`).doc(this.addForm.controls["name"].value).set(data);
        console.log("Saved Successfully")
        this.router.navigate(["custom-departures"]);
      });

      return true;
    }
    catch(e) {
      console.log(e);
      return false;
    }
  }
}
