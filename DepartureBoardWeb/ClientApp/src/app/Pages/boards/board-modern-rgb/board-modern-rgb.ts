import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
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
export class BoardModernRgb extends Board implements AfterViewInit {
  @ViewChild('carImage') carImage: ElementRef;

  constructor(
    http: HttpClient,
    router: Router,
    datePipe: DatePipe
  ) {
    super(http, router, datePipe);
    this.AmountPerPage = 11;
  }

  ngAfterViewInit() {
    if (this.Length) {
      this.drawCarImage();
    }
  }

  drawCarImage() {
    const canvas = this.carImage.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Failed to get carImage context")
      return;
    }

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    ctx.beginPath();
    this.drawFrontCarriage(ctx);

    for (let i = 1; i < this.Length; i++) {
      this.drawCarriage(ctx, 20 * i);
    }

    ctx.stroke();

    ctx.font = "bold 18px Railway";
    ctx.fillStyle = "white";
    ctx.fillText(`x${this.Length}`, 20 * this.Length + 5, 15)
  }

  drawFrontCarriage(ctx: CanvasRenderingContext2D) {
    const lineLength = 15;
    //ctx.setLineDash([1.5, 0.5]);
    ctx.moveTo(0, lineLength);
    ctx.lineTo(lineLength, 0);
    ctx.lineTo(lineLength, lineLength);
    ctx.lineTo(0, lineLength);
  }

  drawCarriage(ctx: CanvasRenderingContext2D, startX: number) {
    const lineLength = 15;
    //ctx.setLineDash([1.5, 0.5]);
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX + lineLength, 0);
    ctx.lineTo(startX + lineLength, lineLength);
    ctx.lineTo(startX, lineLength);
    ctx.lineTo(startX, 0);
  }
}
