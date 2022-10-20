import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import {
  map,
  shareReplay,
  switchMap,
} from "rxjs/operators";
import { Departure } from "src/app/models/departure.model";
import { DepartureService } from "src/app/Services/departure.service";
import { Board } from "../boards/board/board";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements AfterViewInit {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private resolver: ComponentFactoryResolver,
    private departureService: DepartureService
  ) {}

  searchForm = new FormControl();
  isLoadingStations = false;
  hasLoadedExampleBoard = false;

  @ViewChild("board", { read: ViewContainerRef, static: true })
  board: ViewContainerRef;

  @ViewChild('searchView') searchView: ElementRef;

  ngAfterViewInit(): void {
    this.startExampleBoard();
  }

  startExampleBoard() {
    this.isHandset$
      .pipe(
        switchMap((isHandset) => {
          return !isHandset
            ? this.departureService.GetDepartures(
                "EUS",
                1,
                false,
                null,
                "REALTIMETRAINS"
              )
            : new Observable<Departure[]>(obs => obs.complete());
        })
      )
      ?.subscribe(
        (data) => {
          this.hasLoadedExampleBoard = true;
          if (!data && data.length == 0) {
            return;
          }

          this.board.clear();
          const factory = this.resolver.resolveComponentFactory(Board);
          const componentRef = this.board.createComponent(factory);
          componentRef.instance.Initilize(data[0]);
        },
        null,
        () => (this.hasLoadedExampleBoard = true)
      );
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

    scrollToSearch() {
      const elementRect = this.searchView.nativeElement.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - (elementRect.height / 2);
      window.scrollTo(0, middle); // have a window object reference in your component
    }
}
