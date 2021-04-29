import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { CompanyUserService } from 'src/app/company/company-user.service';
import { Project } from 'src/app/interfaces/project/Project';
import { CustomerRole } from 'src/app/interfaces/Role';
import { User } from 'src/app/interfaces/User';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { ProjectService } from 'src/app/project/project.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private projectUserService: ProjectUserService,
    private companyUserService: CompanyUserService
  ) {
    super();
  }

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    this.subscribe(this.getAllResources(companyId).pipe(first()));
  }

  private getAllResources(companyId: string): Observable<void> {
    const getAllProjectsUsersObservable = this.projectService
      .getProjects(companyId)
      .pipe(
        switchMap((projects) => {
          const projectUserObservables = projects.map((project) =>
            this.projectUserService.getProjectUsers(project.id).pipe(
              first(),
              map((users) => ({ project, users }))
            )
          );

          return forkJoin(projectUserObservables).pipe(first());
        })
      );

    return forkJoin([
      getAllProjectsUsersObservable,
      this.companyUserService.getCompanyUsers(companyId),
    ]).pipe(
      // Get all clients with their projects
      map(([projects, companyUsers]) => {
        const customerMap = new Map<User, Array<Project>>();

        // Search for all the projects to find their customers
        for (const { project, users: projectUsers } of projects) {
          for (const projectUser of projectUsers) {
            if (projectUser.roles.find((x) => x.name === CustomerRole)) {
              // projectUser is a customer in this project
              const customer = projectUser.user;

              const projectsOfTheCustomer = customerMap.get(customer);
              if (projectsOfTheCustomer) {
                // Add to already known projects
                projectsOfTheCustomer.push(project);
              } else {
                // First known project for this customer
                customerMap.set(customer, [project]);
              }
            }
          }
        }

        // Make sure we also get customers with no projects
        for (const companyUser of companyUsers) {
          if (companyUser.roles.find((x) => x.name === CustomerRole)) {
            const customer = companyUser.user;

            if (!customerMap.has(customer)) {
              // The user is a customer, but he didn't appear in any of the projects
              customerMap.set(customer, []);
            }
          }
        }

        this.tableData = [...customerMap].map(([customer, projects]) => ({
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
