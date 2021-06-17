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
    private router: Router
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
      this.projectUserService.getProjectUsers(this.projectId),
      (data) => {
        this.listOfProjectUsers = data;
        this.subscribe(
          forkJoin([
            this.issueService.getIssues(this.projectId, {
              getTimeSheets: !this.hasRole('Kunde'),
            }),
          ]),
          (dataList) => {
            this.listOfIssues = dataList[0];

            this.search();

            this.loading = false;
          },
          (error) => {
            this.modal.error({
              nzTitle: 'Error beim laden der Tickets',
              nzContent:'',
            });

            this.loading = false;
          }
        );
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
      (data) => {},
      (error) => {
        this.modal.error({
          nzTitle: 'Errore beim Speichern des TODOs.',
          nzContent: '',
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
    );
  }

  hasRole(roleName: string): boolean {
    return this.listOfProjectUsers
      .filter(
        (user) => user.user.id === this.authService.currentUserValue.id
      )[0]
      ?.roles.some((r) => r.name === roleName);
  }

  timerClicked(): void {
    this.getIssues();
  }
}
