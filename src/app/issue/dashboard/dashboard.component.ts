import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableFilterList } from 'ng-zorro-antd/table';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  cardDesign: boolean = false;
  btnCardDesignTitle: string = 'Card Design';

  ngOnInit(): void {
    this.getAllIssues();
  }

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
      a.issueDetail.startDate.getTime() - b.issueDetail.startDate.getTime()
    );
  }

  sortColumnDeadline(a: Issue, b: Issue): number {
    return a.issueDetail.endDate.getTime() - b.issueDetail.endDate.getTime();
  }

  sortColumnState(a: Issue, b: Issue): number {
    return a.state.name.localeCompare(b.state.name);
  }

  listOfFilterStates: NzTableFilterList;

  filterState(list: string[], item: Issue): Boolean {
    return list.some((name) => item.state.name.indexOf(name) !== -1);
  }

  listOfFilterPriorities: NzTableFilterList;

  filterPriority(list: number[], item: Issue): Boolean {
    return list.some((name) => name == item.issueDetail.priority);
  }

  listOfFilterWorkers: NzTableFilterList;

  filterWorker(list: string[], item: Issue): Boolean {
    return list.some((name) =>
      item.assignedUsers.some((user) => user.id == name)
    );
  }
}
