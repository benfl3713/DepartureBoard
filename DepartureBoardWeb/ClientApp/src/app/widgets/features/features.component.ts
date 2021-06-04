import { Component, OnInit } from '@angular/core';
import { Features } from "./features.items";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  features = Features;

  constructor() { }

  ngOnInit(): void {
  }

}
