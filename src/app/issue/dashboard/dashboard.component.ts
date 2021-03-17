import { Component, OnInit } from '@angular/core';
import { issue } from 'src/app/interfaces/issue';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  listOfIssues: issue[];

}
