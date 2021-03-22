import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor(private issueService: IssueService) { }

  ngOnInit(): void {
  }

  listOfIssues: Issue[];

  getAllIssues() {
    this.issueService.getIssues().subscribe(
      (data) => {
        this.listOfIssues = data;  
    },
      (error) => {
        console.error(error);
      })
    }

}
