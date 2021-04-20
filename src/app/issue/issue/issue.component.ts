import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';
import { IssuePredecessor } from '../../interfaces/issue/IssuePredecessor';
import { IssueSuccessor } from '../../interfaces/issue/IssueSuccessor';
import { IssuePredecessorService } from '../issue-predecessors.service';
import { IssueSuccessorService } from '../issue-successors.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.less'],
})
export class IssueComponent implements OnInit {
  issueId: string;
  projectId: string;
  issue: Issue;
  issuePredecessors: IssuePredecessor[];
  issueSuccessors: IssueSuccessor[];
  loading: boolean = true;
  drawerVisible: boolean = false;
  newRequirement: string = '';

  currenActivComponent: number = 0;

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private authService: AuthService,
    private issuePredecessorService: IssuePredecessorService,
    private issueSuccessorService: IssueSuccessorService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.issueId = params.get('issueId');
      this.projectId = params.get('projectId');
      this.getDatas();
    });
  }

  changedSelectedMenu(selected: number) {
    if (selected !== this.currenActivComponent)
      this.currenActivComponent = selected;
  }

  getDatas() {
    this.loading = true;

    //TODO Predecessor und Successor wieder implementieren
    forkJoin([
      this.issueService.getIssue(this.projectId, this.issueId),
      // this.issuePredecessorService.getPredecessors(this.issueId),
      // this.issueSuccessorService.getSuccessors(this.issueId),
    ]).subscribe(
      (dataList) => {
        this.issue = dataList[0];

        // this.issuePredecessors = dataList[1];
        // this.issueSuccessors = dataList[2];
        this.loading = false;
      },
      (error) => {
        // TODO Fehlerausgabe
        console.error(error);
        this.loading = false;
      }
    );
  }

  openDrawer(requirement: string = ''): void {
    this.newRequirement = requirement;
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
    console.log('New requirement: ' + this.newRequirement);
  }
}
