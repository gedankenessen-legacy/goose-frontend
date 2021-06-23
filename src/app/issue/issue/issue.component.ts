import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueChildren } from 'src/app/interfaces/issue/IssueChildren';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';
import { IssueRequirement } from 'src/app/interfaces/issue/IssueRequirement';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { StateService } from 'src/app/project/state.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { IssueChildrenService } from '../issue-children.service';
import { IssuePredecessorService } from '../issue-predecessors.service';
import { IssueRequirementsService } from '../issue-requirements.service';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.less'],
})
export class IssueComponent extends SubscriptionWrapper implements OnInit {
  issueId: string;
  projectId: string;
  companyId: string;
  issue: Issue;
  issuePredecessors: Issue[];
  issueChildren: IssueChildren[];
  loading: boolean = true;
  drawerVisible: boolean = false;
  newRequirement: string = '';
  currentUser: ProjectUser;
  requirements: IssueRequirement[];
  observable: Observable<IssueConversationItem>;

  currenActivComponent: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private IssueRequirementService: IssueRequirementsService,
    private authService: AuthService,
    private projectUserService: ProjectUserService,
    private stateService: StateService,
    private modal: NzModalService,
    private issuePredecessorService: IssuePredecessorService,
    private issueChildrenService: IssueChildrenService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.issueId = params.get('issueId');
      this.projectId = params.get('projectId');
      this.companyId = params.get('companyId');

      this.getDatas();
    });
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment !== null) this.changedSelectedMenu(parseInt(fragment));
    });
  }

  changedSelectedMenu(selected: number) {
    if (selected !== this.currenActivComponent)
      this.currenActivComponent = selected;
  }

  routeToIssue(issueId: string): void {
    this.router
      .navigateByUrl(
        `${this.companyId}/projects/${this.projectId}/issues/${issueId}`
      )
      .then();
  }

  getDatas() {
    this.loading = true;

    this.subscribe(
      forkJoin([
        this.projectUserService.getProjectUser(
          this.projectId,
          this.authService.currentUserValue.id
        ),
        this.issueService.getIssue(this.projectId, this.issueId),
        this.IssueRequirementService.getRequirements(this.issueId),
        this.issuePredecessorService.getPredecessors(this.issueId),
        this.issueChildrenService.getChildren(this.issueId, false),
      ]),
      (dataList) => {
        this.currentUser = dataList[0];
        this.issue = dataList[1];
        this.requirements = dataList[2];
        this.issuePredecessors = dataList[3];
        this.issueChildren = dataList[4];

        this.loading = false;
      },
      (error) => {
        this.modal.error({
          nzTitle: 'Error beim laden des Tickets.',
          nzContent: '',
        });

        this.loading = false;
      }
    );
  }

  saveRequirement(): void {
    const requirement: IssueRequirement = {
      requirement: this.newRequirement,
    };

    this.subscribe(
      this.IssueRequirementService.createRequirement(this.issueId, requirement),
      (data) => {
        this.requirements = [...this.requirements, data];

        this.newRequirement = '';
      },
      (error) => {
        this.modal.error({
          nzTitle: 'Das Requirement konnte nicht gespeichert werden.',
          nzContent: '',
        });
      }
    );
  }

  removeRequirement(requirementId: string): void {
    this.subscribe(
      this.IssueRequirementService.deleteRequirement(
        this.issueId,
        requirementId
      ),
      (data) => {
        this.requirements = this.requirements.filter(
          (requirement) => requirement.id !== requirementId
        );
      },
      (error) => {
        this.modal.error({
          nzTitle: 'Das Requirement konnte nicht entfernt werden.',
          nzContent: '',
        });
      }
    );
  }

  openDrawer(requirement: string = ''): void {
    this.newRequirement = requirement;
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  hasRole(roleName: string): boolean {
    return (
      this.currentUser?.roles.filter((role) => role.name === roleName).length >=
      1
    );
  }

  isPhase(phaseName: string): boolean {
    return this.issue?.state.phase === phaseName;
  }

  isState(stateName: string): boolean {
    return this.issue?.state.name === stateName;
  }

  customerIsAuthor(): boolean {
    return (
      this.hasRole('Kunde') &&
      this.issue?.author.id === this.authService.currentUserValue.id
    );
  }

  canEditIssue(): boolean {
    return (
      !this.isPhase('Abschlussphase') &&
      (this.customerIsAuthor() ||
        (!this.hasRole('Mitarbeiter (Lesend)') && !this.hasRole('Kunde')))
    );
  }

  canCancelIssue(): boolean {
    return (
      !this.isState('Abgebrochen') &&
      (this.hasRole('Kunde') ||
        this.hasRole('Projektleiter') ||
        this.hasRole('Firma'))
    );
  }

  cancelIssue(): void {
    this.subscribe(
      this.stateService.getStates(this.projectId),
      (data) => {
        const state = data.filter((state) => state.name == 'Abgebrochen');
        this.subscribe(
          this.issueService.updateIssue(this.projectId, this.issueId, {
            ...this.issue,
            state: state[0],
          }),
          (data) => {
            this.getDatas();
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
