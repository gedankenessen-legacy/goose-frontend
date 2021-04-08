import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';

import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor(private issueService: IssueService, 
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllIssues();
  }

  listOfIssues: Issue[];

  routeToIssue(issueId: string) {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    const projectId = this.route.snapshot.paramMap.get('projectId');
    console.log(companyId);
    this.router.navigateByUrl(`${companyId}/projects/${projectId}/issues/${issueId}`).then();
  }
  

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
