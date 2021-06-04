import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/base.service';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueRequirement } from 'src/app/interfaces/issue/IssueRequirement';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import {
  CompanyRole,
  EmployeeRole,
  ProjectLeaderRole,
} from 'src/app/interfaces/Role';
import { User } from 'src/app/interfaces/User';
import { ProjectUserService } from 'src/app/project/project-user.service';
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
    private issueSummaryService: IssueSummaryService,
    private projectUserService: ProjectUserService,
    private auth: AuthService
  ) {
    super();
  }

  listOfRequirements: IssueRequirement[];

  issueId: string;
  projectId: string;
  companyId: string;
  currentIssue: Issue;
  projectUser: ProjectUser;
  user: User;

  expectedTime: number = 0;
  summaryCreated: Boolean;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    this.subscribe(this.auth.currentUser, (user) => (this.user = user));
    this.subscribe(
      this.projectUserService.getProjectUser(this.projectId, this.user.id),
      (pUser) => (this.projectUser = pUser)
    );

    this.getAllRequirements();
  }

  checkAuthorizationSend(): Boolean {
    if (
      this.projectUser?.roles?.some(
        (r) => r.name === ProjectLeaderRole || r.name === CompanyRole
      )
    ) {
      return false;
    }
    return true;
  }

  checkAuthorizationDelete(): Boolean {
    return !this.projectUser?.roles?.some(
      (r) =>
        r.name === ProjectLeaderRole ||
        r.name === CompanyRole ||
        r.name === EmployeeRole
    );
  }

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
    this.issueSummaryService
      .createSummary(this.issueId, this.expectedTime)
      .pipe(tap(() => (this.summaryCreated = true)))
      .subscribe();
  }
}
