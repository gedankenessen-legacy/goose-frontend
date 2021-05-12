import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableFilterList } from 'ng-zorro-antd/table';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { AuthService } from 'src/app/auth/auth.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { ProjectService } from 'src/app/project/project.service';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { StateService } from 'src/app/project/state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent extends SubscriptionWrapper implements OnInit {
  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService,
    private projectUserService: ProjectUserService,
    private stateService: StateService
  ) {
    super();
  }

  cardDesign: boolean = false;
  btnCardDesignTitle: string = 'Card Design';

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.getAllIssues();
  }

  companyId: string;
  projectId: string;

  routeToIssue(issueId: string) {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    const projectId = this.route.snapshot.paramMap.get('projectId');
    this.router
      .navigateByUrl(`${companyId}/projects/${projectId}/issues/${issueId}`)
      .then();
  }

  listOfIssues: Issue[];

  getAllIssues() {
    const companyId = this.route.snapshot.paramMap.get('projectId');
    this.listOfFilterPriorities = [];
    this.listOfFilterWorkers = [];
    this.listOfFilterStates = [];
    this.listOfIssues = [];
    this.subscribe(this.issueService.getIssues(this.projectId), (data) => {
      this.listOfIssues = data;
      this.listOfIssues.forEach((data) =>
        this.listOfFilterWorkers.push({
          text: data.author.firstname + data.author.lastname,
          value: data.author.id,
        })
      );
      console.log('test2');
    });

    this.subscribe(
      this.projectUserService.getProjectUsers(this.projectId),
      (data) => {
        this.listOfProjectUsers = data;
      }
    );
    this.subscribe(this.stateService.getStates(this.projectId), (data) =>
      data.forEach((data) =>
        this.listOfFilterStates.push({ text: data.name, value: data.name })
      )
    );
    for (let i = 0; i < 11; i++) {
      this.listOfFilterPriorities.push({ text: i.toString(), value: i });
    }
  }

  toggleCardDesign() {
    this.cardDesign = !this.cardDesign;
    if (this.cardDesign) this.btnCardDesignTitle = 'Table Design';
    else this.btnCardDesignTitle = 'Card Design';
  }

  listOfProjectUsers: ProjectUser[] = [];

  public cannotCreateIssue(): Boolean {
    let loggedInUser = this.authService.currentUserValue;
    let user = this.listOfProjectUsers.filter(
      (user) => user.user.id === loggedInUser.id
    )[0];
    return (
      user?.roles.some((r) => r.name === 'Kunde') ||
      user?.roles.some((r) => r.name === 'Mitarbeiter (Lesend)')
    ); // Exclude Users with Roles without write permission
  }

  sortColumnIssue(a: Issue, b: Issue): number {
    return a.issueDetail.name.localeCompare(b.issueDetail.name);
  }

  sortColumnProgress(a: Issue, b: Issue): number {
    return a.issueDetail.progress - b.issueDetail.progress;
  }

  sortColumnStart(a: Issue, b: Issue): number {
    return (
      new Date(a.issueDetail.startDate).getTime() -
      new Date(b.issueDetail.startDate).getTime()
    );
  }

  sortColumnDeadline(a: Issue, b: Issue): number {
    return (
      new Date(a.issueDetail.endDate).getTime() -
      new Date(b.issueDetail.endDate).getTime()
    );
  }

  sortColumnState(a: Issue, b: Issue): number {
    return a.state.name.localeCompare(b.state.name);
  }

  listOfFilterStates: NzTableFilterList;

  filterState(list: string[], item: Issue): Boolean {
    return list?.some((name) => item.state.name.indexOf(name) !== -1);
  }

  listOfFilterPriorities: NzTableFilterList;

  filterPriority(list: number[], item: Issue): Boolean {
    return list?.some((name) => name == item.issueDetail.priority);
  }

  listOfFilterWorkers: NzTableFilterList;

  filterWorker(list: string[], item: Issue): Boolean {
    return list?.some((element) => element == item.author.id);
  }
}
