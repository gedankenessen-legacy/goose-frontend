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
  projectId: string;
  companyId: string;
  searchValue: string;
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

  cardDesign: boolean;
  searchVisible: boolean = false;
  btnCardDesignTitle: string = 'Card Design';

  ngOnInit(): void {
    this.cardDesign = JSON.parse(localStorage.getItem('card_design')) ?? false;
    this.setBtnCardDesignTitle();
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.getAllIssues();
  }

  routeToIssue(issueId: string) {
    this.router
      .navigateByUrl(
        `${this.companyId}/projects/${this.projectId}/issues/${issueId}`
      )
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
      console.log(this.listOfIssues[0].state);
      this.listOfIssues.forEach((issue) =>
        this.listOfFilterWorkers.push({
          text: issue.author.firstname + " " + issue.author.lastname,
          value: issue.author.id,
        })
      );
      this.listOfIssues.forEach((issue) =>
        this.listOfFilterStates.push({
          text: issue.state?.name,
          value: issue.state?.id,
        })
      );
      this.listOfFilterWorkers = this.listOfFilterWorkers.filter(this.onlyUnique);
    });

    this.subscribe(
      this.projectUserService.getProjectUsers(this.projectId),
      (data) => {
        this.listOfProjectUsers = data;
      }
    );
    /*this.subscribe(this.stateService.getStates(this.projectId), (data) =>
      data.forEach((data) =>
        this.listOfFilterStates.push({ text: data.name, value: data.name })
      )
    );*/
    //this.listOfFilterStates = this.listOfFilterStates.filter(this.onlyUnique);
    for (let i = 0; i < 11; i++) {
      this.listOfFilterPriorities.push({ text: i.toString(), value: i });
    }
  }

  toggleCardDesign(): void {
    this.cardDesign = !this.cardDesign;
    localStorage.setItem('card_design', JSON.stringify(this.cardDesign));
    this.setBtnCardDesignTitle();
  }

  setBtnCardDesignTitle(): void {
    this.btnCardDesignTitle = this.cardDesign ? 'Table Design' : 'Card Design';
  }

  toggleSearch(): void {
    this.searchVisible = !this.searchVisible;
    if (!this.searchVisible) this.searchValue = '';
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

  onlyUnique(value: {text, value}, index, self) {
    //console.log(value.text + " " + self.indexOf(value) +  " " + index);
    return self.indexOf(value) == index;
  }


}
