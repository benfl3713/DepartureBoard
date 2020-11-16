import { Component, OnInit } from "@angular/core";
import { NewsItems } from "./news.items";

@Component({
  selector: "app-components-widgets-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
})
export class NewsWidgetComponent implements OnInit {
  constructor() {}

  newsItems = NewsItems;

  ngOnInit(): void {}
}
