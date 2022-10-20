import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import {navItemList} from "../menu-items"

@Component({
  selector: 'app-nav-menu-mobile',
  templateUrl: './nav-menu-mobile.component.html',
  styleUrls: ['./nav-menu-mobile.component.css']
})
export class NavMenuMobileComponent implements OnInit {

  menuItems = navItemList;

  @Output() pageClicked = new EventEmitter<void>();

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

  PageChanged() {
    this.pageClicked.emit();
  }

}
