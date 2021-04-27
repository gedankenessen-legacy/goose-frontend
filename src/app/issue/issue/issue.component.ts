import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, ReplaySubject, Subject } from 'rxjs';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';
import { IssuePredecessor } from '../../interfaces/issue/IssuePredecessor';
import { IssueSuccessor } from '../../interfaces/issue/IssueSuccessor';
import { IssuePredecessorService } from '../issue-predecessors.service';
import { IssueSuccessorService } from '../issue-successors.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { IssueRequirement } from 'src/app/interfaces/issue/IssueRequirement';
import { IssueRequirementsService } from '../issue-requirements.service';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';
// import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.less'],
})
export class IssueComponent extends SubscriptionWrapper implements OnInit {
  issueId: string;
  projectId: string;
  issue: Issue;
  issuePredecessors: IssuePredecessor[];
  issueSuccessors: IssueSuccessor[];
  loading: boolean = true;
  drawerVisible: boolean = false;
  newRequirement: string = '';
  currentUser: ProjectUser;
  requirements: IssueRequirement[];
  // issueSubject = new ReplaySubject<Issue>();
  observable: Observable<IssueConversationItem>;

  currenActivComponent: number = 0;

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private IssueRequirementService: IssueRequirementsService,
    private authService: AuthService,
    private projectUserService: ProjectUserService,
    // private modal: NzModalService,
    private issuePredecessorService: IssuePredecessorService,
    private issueSuccessorService: IssueSuccessorService
  ) {
    super();
  }

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
    this.subscribe(
      forkJoin([
        this.projectUserService.getProjectUser(
          this.projectId,
          this.authService.currentUserValue.id
        ),
        this.issueService.getIssue(this.projectId, this.issueId),
        this.IssueRequirementService.getRequirements(this.issueId),
        // this.issuePredecessorService.getPredecessors(this.issueId),
        // this.issueSuccessorService.getSuccessors(this.issueId),
      ]),
      (dataList) => {
        // console.log(dataList);

        this.currentUser = dataList[0];
        this.issue = dataList[1];
        this.requirements = dataList[2];
        // this.issuePredecessors = dataList[1];
        // this.issueSuccessors = dataList[2];
        this.loading = false;
      },
      (error) => {
        console.error(error);
        // this.modal.error({
        //   nzTitle: 'This is an error message',
        //   nzContent: 'some messages...some messages...',
        // });

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
        //TODO Fehlerausgabe
        console.error(error);
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
        //TODO Fehlerausgabe
        console.error(error);
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
      this.currentUser.roles.filter((role) => role.name === roleName).length >=
      1
    );
  }

  isPhase(phaseName: string): boolean {
    return this.issue?.state.phase === phaseName;
  }
}
