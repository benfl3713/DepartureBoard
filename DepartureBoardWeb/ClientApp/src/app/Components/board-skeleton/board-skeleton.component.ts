import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-board-skeleton',
  templateUrl: './board-skeleton.component.html',
  styleUrls: ['./board-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
