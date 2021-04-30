import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { CompanyUserService } from 'src/app/company/company-user.service';
import { Project } from 'src/app/interfaces/project/Project';
import { CompanyRole, CustomerRole } from 'src/app/interfaces/Role';
import { User } from 'src/app/interfaces/User';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { ProjectService } from 'src/app/project/project.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { AuthService } from '../../auth/auth.service';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';

interface TableEntry {
  customer: User;
  projectNames: string;
}

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.less'],
})
export class CustomerDashboardComponent
  extends SubscriptionWrapper
  implements OnInit {
  public tableData = new Array<TableEntry>();
  QAButtonSize: NzButtonSize = 'default';

  isCompanyAccount: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private projectUserService: ProjectUserService,
    private companyUserService: CompanyUserService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    this.subscribe(this.getAllResources(companyId).pipe(first()));
  }

  private getAllResources(companyId: string): Observable<void> {
    const getAllProjectsUsersObservable: Observable<
      {
        project: Project;
        users: ProjectUser[];
      }[]
    > = this.projectService.getProjects(companyId).pipe(
      switchMap((projects) => {
        const projectUserObservables = projects.map((project) =>
          this.projectUserService.getProjectUsers(project.id).pipe(
            first(),
            map((users) => ({ project, users }))
          )
        );

        if (projectUserObservables.length === 0) {
          // forkjoin gibt nie werte zurück, wenn es keine Observables gibt.
          // Dies verursacht dann Fehler beim pipe(first())
          return of([]);
        }

        return forkJoin(projectUserObservables).pipe(first());
      })
    );

    return forkJoin([
      getAllProjectsUsersObservable,
      this.companyUserService.getCompanyUsers(companyId),
    ]).pipe(
      // Get all clients with their projects
      map(([projects, companyUsers]) => {
        const customerProjects = new Array<{ customer: User, projects: Array<Project>}>();

        // Search for all the projects to find their customers
        for (const { project, users: projectUsers } of projects) {
          for (const projectUser of projectUsers) {
            if (projectUser.roles.some((x) => x.name === CustomerRole)) {
              // projectUser is a customer in this project
              const customer = projectUser.user;

              const customerProject = customerProjects.find(x => x.customer.id === customer.id);
              if (customerProject) {
                // Add to already known projects
                customerProject.projects.push(project);
              } else {
                // First known project for this customer
                customerProjects.push({
                  customer,
                  projects: new Array(project),
                });
              }
            }
          }
        }

        // Make sure we also get customers with no projects
        for (const companyUser of companyUsers) {
          // Check if companyUser is the Company Account
          if (
            companyUser.user.id === this.authService.currentUserValue.id &&
            companyUser.roles.some((x) => x.name === CompanyRole)
          ) {
            this.isCompanyAccount = true;
            continue;
          }

          if (companyUser.roles.some((x) => x.name === CustomerRole)) {
            const customer = companyUser.user;

            if (!customerProjects.some(x => x.customer.id === customer.id)) {
              // The user is a customer, but he didn't appear in any of the projects
              customerProjects.push({
                customer,
                projects: new Array()
              });
            }
          }
        }

        this.tableData = customerProjects.map(({customer, projects}) => ({
          customer,
          projectNames: this.getProjectNames(projects),
        }));
      })
    );
  }

  private getProjectNames(projects: Array<Project>): string {
    if (projects.length === 0) {
      return 'Keine Projekte';
    } else {
      return projects.map((x) => x.name).join(', ');
    }
  }

  public sortCustomers(a: TableEntry, b: TableEntry): number {
    const firstNameComp = a.customer.firstname.localeCompare(
      b.customer.firstname
    );

    if (firstNameComp !== 0) {
      return firstNameComp;
    }

    return a.customer.lastname.localeCompare(b.customer.lastname);
  }
}
