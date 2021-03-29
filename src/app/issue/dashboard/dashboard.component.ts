import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';

import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor(private issueService: IssueService, 
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.getAllIssues();
  }

  listOfIssues: Issue[];
  

  getAllIssues() {
    const companyId = this.route.snapshot.paramMap.get('projectId'); 
    this.issueService.getIssues(companyId).subscribe(
      (data) => {
        this.listOfIssues = data;
    },
      (error) => {
        console.error(error);
      })
    }

}
