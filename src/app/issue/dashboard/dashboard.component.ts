import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
  projectId:string;
  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  cardDesign: boolean = false;
  btnCardDesignTitle: string = "Card Design"

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.getAllIssues();
  }

  routeToIssue(issueId: string) {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    this.router
      .navigateByUrl(`${companyId}/projects/${this.projectId}/issues/${issueId}`)
      .then();
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
      }
    );
  }

  toggleCardDesign() {
    this.cardDesign = !this.cardDesign;
    if (this.cardDesign) this.btnCardDesignTitle = 'Table Design';
    else this.btnCardDesignTitle = 'Card Design';
  }
}
