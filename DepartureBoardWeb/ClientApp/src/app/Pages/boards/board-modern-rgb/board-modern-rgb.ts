import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {Board} from "../board/board";

@Component({
  selector: "app-board",
  templateUrl: "./board-modern-rgb.html",
  styleUrls: [
    "../board/board.css",
    "./board-modern-rgb.css"
  ],
})
export class BoardModernRgb extends Board {
  constructor(
    http: HttpClient,
    router: Router,
    datePipe: DatePipe
  ) {
    super(http, router, datePipe);
    this.AmountPerPage = 11;
  }
}
