import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/base.service';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueRequirement } from 'src/app/interfaces/issue/IssueRequirement';
import { User } from 'src/app/interfaces/User';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { IssueRequirementsService } from '../issue-requirements.service';
import { IssueSummaryService } from '../issue-summary.service';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.less'],
})
export class SummaryComponent extends SubscriptionWrapper implements OnInit {
  constructor(
    private issueRequirementsService: IssueRequirementsService,
    private route: ActivatedRoute,
    private base: BaseService,
    private httpClient: HttpClient,
    private authService: AuthService,
    private issueService: IssueService,
    private router: Router,
    private issueSummaryService: IssueSummaryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    this.getAllRequirements();
  }

  listOfRequirements: IssueRequirement[];

  issueId: string;
  projectId: string;
  companyId: string;
  currentIssue: Issue;

  expectedTime: number = 0;
  summaryCreated: Boolean;

  getAllRequirements() {
    this.listOfRequirements = [];
    this.subscribe(
      this.issueRequirementsService.getRequirements(this.issueId),
      (data) => (this.listOfRequirements = data)
    );
    this.subscribe(
      this.issueService.getIssue(this.projectId, this.issueId),
      (data) => (this.currentIssue = data)
    );
  }

  removeRequirement(req: IssueRequirement) {
    this.subscribe(
      this.issueRequirementsService.deleteRequirement(
        this.route.snapshot.paramMap.get('issueId'),
        req.id
      ),

      (data) => {
        this.listOfRequirements = this.listOfRequirements.filter(
          (requirement) => requirement.id !== req.id
        );
      }
    );
  }

  sendSummary() {
    const issue = {
      ...this.currentIssue,
      issueDetail: {
        ...this.currentIssue.issueDetail,
        expectedTime: this.expectedTime,
      },
    };

    this.subscribe(
      this.issueService.updateIssue(this.projectId, this.issueId, issue)
    );

    this.subscribe(
      this.issueSummaryService.createSummary(
        this.issueId,
        this.listOfRequirements
      ),
      (data) => (this.summaryCreated = true)
    );
  }
}
