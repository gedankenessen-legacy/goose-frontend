import { Component, OnInit } from '@angular/core';
import { issueDashboard } from 'src/app/interfaces/issueDashboard/issueDashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  listOfIssues: issueDashboard[];

}
