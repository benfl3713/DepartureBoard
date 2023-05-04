import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Speech } from 'src/app/RAG/Speech';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-components-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ExamplesComponent implements OnInit {
  constructor() { document.title = "Examples - Departure Board"; }

  ngOnInit() {
  }
}
