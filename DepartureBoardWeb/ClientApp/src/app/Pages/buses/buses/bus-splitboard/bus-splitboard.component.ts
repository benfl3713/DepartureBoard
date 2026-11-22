import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {combineLatest, Subscription} from "rxjs";

interface SplitBoardConfig {
  atco: string;
  dataSource: string;
}

/** Shows 2-4 bus stops at once: side by side for 2, a 2x2 grid for 3 or 4. */
@Component({
  selector: "app-bus-splitboard",
  templateUrl: "./bus-splitboard.component.html",
  styleUrls: ["./bus-splitboard.component.css"],
})
export class BusSplitboardComponent implements OnInit, OnDestroy {
  static readonly MaxBoards = 4;

  constructor(private route: ActivatedRoute) {}

  boards: SplitBoardConfig[] = [];
  count: number = 4;
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = combineLatest([this.route.params, this.route.queryParams])
      .subscribe(([params, queryParams]) => {
        this.count = queryParams.count ?? 4;
        this.boards = [];
        for (let i = 1; i <= BusSplitboardComponent.MaxBoards; i++) {
          if (params[`atco${i}`]) {
            this.boards.push({
              atco: params[`atco${i}`],
              dataSource: queryParams[`datasource${i}`] ?? queryParams.datasource,
            });
          }
        }
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
