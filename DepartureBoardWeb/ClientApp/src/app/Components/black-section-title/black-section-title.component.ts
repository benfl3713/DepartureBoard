import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-black-section-title',
  templateUrl: './black-section-title.component.html',
  styleUrls: ['./black-section-title.component.css']
})
export class BlackSectionTitleComponent implements OnInit {

  @Input() title: any;
  @Input() subtitle: any;
  @Input() icon: string;
  constructor() { }

  ngOnInit() {
  }

  getAnchorUrl():string {
    return "#" + this.title.toLowerCase().replace(/ /g, '-');
  }
}
