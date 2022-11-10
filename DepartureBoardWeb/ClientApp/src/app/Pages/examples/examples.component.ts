import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-components-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ExamplesComponent implements OnInit{
  constructor(private http: HttpClient, private router: Router) { document.title = "Examples - Departure Board"; }

  ngOnInit() {
    // const vox = new Speech();
    //
    // setTimeout(() => vox.speak({
    //   stationCode: 'MYB',
    //   lastUpdated: new Date().toDateString(),
    //   stationName: 'Test',
    //   platform: '3',
    //   operatorName: 'test',
    //   origin: 'test',
    //   destination: '',
    //   status: '',
    //   length: null,
    //   stops: [],
    //   extraDetails: null
    // }, {}), 100);
  }
}
