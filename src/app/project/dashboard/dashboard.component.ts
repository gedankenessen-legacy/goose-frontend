import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Project } from '../../interfaces/project/Project';
import ProjectDashboardContent from '../../interfaces/project/ProjectDashboardContent';
import { Issue } from '../../interfaces/issue/Issue';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectUser } from '../../interfaces/project/ProjectUser';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../project-user.service';
import { IssueService } from 'src/app/issue/issue.service';
import { SubscriptionWrapper } from '../../SubscriptionWrapper';
import { Role } from '../../interfaces/Role';
import { AuthService } from '../../auth/auth.service';
import { CompanyUser } from '../../interfaces/company/CompanyUser';
import { CompanyUserService } from 'src/app/company/company-user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent extends SubscriptionWrapper implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private projectUserService: ProjectUserService,
    private issueService: IssueService,
    private companyUserService: CompanyUserService,
    private authService: AuthService
  ) {
    super();
  }

  companyId: string;
  userId: string;
  loggedInUserCompanyRoles: Role[];

  // TODO: Quick action -> PDF Creation

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.userId = this.authService.currentUserValue.id;
    this.subscribe(
      forkJoin([
        this.getCompanyUser(this.companyId, this.userId),
        this.getAllResources(this.companyId),
      ]),
      () => this.processContent()
    );
  }

  // Attributes
  QAButtonSize: NzButtonSize = 'default';

  // Column Sort functions
  sortColumnProject(a: Project, b: Project): number {
    return a.name.localeCompare(b.name);
  }
  sortColumnCustomer(
    a: ProjectDashboardContent,
    b: ProjectDashboardContent
  ): number {
    return a.customer.lastname.localeCompare(b.customer.lastname);
  }

  // Data lists
  listOfProjects: Project[];
  listOfProjectUsers: Map<string, ProjectUser[]> = new Map<
    string,
    ProjectUser[]
  >();
  listOfIssues: Map<string, Issue[]> = new Map<string, Issue[]>();
  listOfDashboardContent: ProjectDashboardContent[];
  // TODO: Refactor: listOfProjects, listOfProjectUsers, listOfIssues werden nur zum erstellen von listOfDashboardContent benötigt

  isCompanyAccount(): boolean {
    return this.loggedInUserCompanyRoles?.some((r) => r.name === 'Firma');
  }

  private processContent(): void {
    let getCustomer = (projectId: string) => {
      return this.listOfProjectUsers
        .get(projectId)
        .filter((user) => user.roles.some((role) => role.name == 'Kunde'))[0]
        ?.user;
    };

    let hasWritePermission = (projectId: string) => {
      let loggedInUser = this.authService.currentUserValue;
      let user = this.listOfProjectUsers
        .get(projectId)
        .filter((user) => user.user.id === loggedInUser.id)[0];
      return (
        this.isCompanyAccount() ||
        (user?.roles.some((r) => r.name !== 'Kunde') &&
          user?.roles.some((r) => r.name !== 'Mitarbeiter (Lesend)'))
      ); // Exclude Users with Roles without write permission
    };

    this.listOfDashboardContent = this.listOfProjects.map((project) => {
      const issues: Issue[] = this.listOfIssues.get(project.id);

      return {
        id: project.id,
        name: project.name,
        customer: getCustomer(project.id),
        issues: issues.length,
        issuesOpen: issues.filter(
          (issue) => issue.state?.phase != 'Abschlussphase'
        ).length,
        hasWritePermission: hasWritePermission(project.id),
      };
    });
  }

  // Getters
  private getCompanyUser(
    companyId: string,
    userId: string
  ): Observable<CompanyUser> {
    return this.companyUserService
      .getCompanyUser(companyId, userId)
      .pipe(tap((user) => (this.loggedInUserCompanyRoles = user.roles)));
  }

  private getAllResources(companyId: string): Observable<void> {
    return this.projectService.getProjects(companyId).pipe(
      tap((projects) => (this.listOfProjects = projects)),
      switchMap((projects: Project[]) => {
        const ids = projects.map((project) => project.id);

        const projectUser = ids.map((id) =>
          this.projectUserService
            .getProjectUsers(id)
            .pipe(
              tap((projectsUsers) =>
                this.listOfProjectUsers.set(id, projectsUsers)
              )
            )
        );

        const projectIssues = ids.map((id) =>
          this.issueService
            .getIssues(id)
            .pipe(
              tap((projectsIssues) => this.listOfIssues.set(id, projectsIssues))
            )
        );

        return forkJoin([forkJoin(projectUser), forkJoin(projectIssues)]).pipe(
          map(() => null)
        );
      })
    );
  }

  routeToIssueDashboard(projectId: string): void {
    this.router
      .navigateByUrl(`${this.companyId}/projects/${projectId}/issues`)
      .then();
  }
}
