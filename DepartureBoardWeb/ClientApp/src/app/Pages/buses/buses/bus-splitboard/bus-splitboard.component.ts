import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {combineLatest, Subscription} from "rxjs";

interface SplitBoardConfig {
  atco: string;
  dataSource: string;
}

@Component({
  selector: "app-bus-splitboard",
  templateUrl: "./bus-splitboard.component.html",
  styleUrls: ["./bus-splitboard.component.css"],
})
export class BusSplitboardComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute) {}

  boards: SplitBoardConfig[] = [];
  count: number = 4;
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = combineLatest([this.route.params, this.route.queryParams])
      .subscribe(([params, queryParams]) => {
        this.count = queryParams.count ?? 4;
        this.boards = [
          {atco: params.atco1, dataSource: queryParams.datasource1 ?? queryParams.datasource},
          {atco: params.atco2, dataSource: queryParams.datasource2 ?? queryParams.datasource},
        ];
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
