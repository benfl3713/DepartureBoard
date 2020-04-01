import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
	selector: 'app-components-widgets-news',
	templateUrl: './news.component.html',
	styleUrls: ['./news.component.css']
})
export class NewsWidgetComponent implements OnInit {

	constructor(private http: HttpClient, private router: Router) {}

	ngOnInit(): void {
	}
}
