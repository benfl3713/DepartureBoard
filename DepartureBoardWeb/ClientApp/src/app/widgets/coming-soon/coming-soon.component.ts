import { Component, OnInit } from "@angular/core";
import { ComingSoonItems } from "./coming-soon.items";

@Component({
  selector: "app-widget-coming-soon",
  templateUrl: "./coming-soon.component.html",
  styleUrls: ["./coming-soon.component.css"],
})
export class ComingSoonWidgetComponent implements OnInit {
  constructor() {}

  comingSoonItems = ComingSoonItems;

  ngOnInit() {}
}
