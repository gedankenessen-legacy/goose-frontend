import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueRequirement } from 'src/app/interfaces/issue/IssueRequirement';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { IssueRequirementsService } from '../../issue-requirements.service';
import { TimeService } from 'src/app/time.service';
import { IssueService } from '../../issue.service';

@Component({
  selector: 'app-card-design',
  templateUrl: './card-design.component.html',
  styleUrls: ['./card-design.component.less'],
})
export class CardDesignComponent extends SubscriptionWrapper implements OnInit {
  @Input() public projectId: string;
  @Input() public companyId: string;
  @Input() public searchValue: string;

  loading: boolean = false;
  issuesPerPage: number = 6;
  currentPage: number = 1;

  listOfIssues: Issue[];
  listOfDisplayIssues: Issue[];

  constructor(
    private issueService: IssueService,
    private issueRequirementService: IssueRequirementsService,
    private projectUserService: ProjectUserService,
    private authService: AuthService,
    private modal: NzModalService,
    private router: Router,
    private timeService: TimeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getIssues();
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    this.search();
  }

  routeToIssue(issueId: string): void {
    this.router
      .navigateByUrl(
        `${this.companyId}/projects/${this.projectId}/issues/${issueId}`
      )
      .then();
  }

  listOfProjectUsers: ProjectUser[] = [];
  getIssues(): void {
    this.loading = true;
    this.subscribe(
      forkJoin([
        this.issueService.getIssues(this.projectId, { getTimeSheets: true }),
        this.projectUserService.getProjectUsers(this.projectId),
      ]),
      (dataList) => {
        this.listOfIssues = dataList[0];
        this.listOfProjectUsers = dataList[1];
        this.search();

        this.loading = false;
      },
      (error) => {
        this.modal.error({
          nzTitle: 'Fehler beim Laden der Tickets',
          nzContent: 'Error ' + error['Error Code'] + ': ' + error['Message'],
        });

        this.loading = false;
      }
    );
  }

  reqAchievedChanged(
    issueId: string,
    requirement: IssueRequirement,
    event
  ): void {
    this.subscribe(
      this.issueRequirementService.updateRequirement(issueId, requirement.id, {
        ...requirement,
        achieved: event.target.checked,
      }),
      (data) => { },
      (error) => {
        this.modal.error({
          nzTitle: 'Fehler beim Speichern des Achieved zustandes.',
          nzContent: 'Error ' + error['Error Code'] + ': ' + error['Message'],
        });
      }
    );
  }

  search(): void {
    this.listOfDisplayIssues = !this.searchValue
      ? this.listOfIssues
      : this.listOfIssues.filter((issue) =>
        new RegExp(`(.*?)${this.searchValue}(.*?)`, 'i').test(
          issue.issueDetail.name
        )
      );
  }

  cannotChangeRequirements(): Boolean {
    let loggedInUser = this.authService.currentUserValue;
    let user = this.listOfProjectUsers.filter(
      (user) => user.user.id === loggedInUser.id
    )[0];

    return !user?.roles.some(
      (role) =>
        role.name === 'Mitarbeiter' ||
        role.name === 'Firma' ||
        role.name === 'Projektleiter'
    ); // Exclude Users with Roles without write permission
  }
}
