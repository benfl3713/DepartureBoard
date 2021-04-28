import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-splash-screen",
  templateUrl: "./splash-screen.component.html",
  styleUrls: ["./splash-screen.component.css"],
})
export class SplashScreenComponent implements OnInit {
  constructor() {}

  @Input() color: "primary" | "accent" | "warn" = "primary";
  @Input() text: string;

  ngOnInit(): void {}
}
