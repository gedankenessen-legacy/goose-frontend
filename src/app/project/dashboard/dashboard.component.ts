import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { forkJoin, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { Project } from '../../interfaces/project/Project';
import ProjectDashboardContent from '../../interfaces/project/ProjectDashboardContent';
import { Issue } from "../../interfaces/issue/Issue";
import { ProjectDashboardService } from "../project-dashboard.service";
import { Router } from "@angular/router";
import { ProjectUser } from "../../interfaces/project/ProjectUser";
import { toNumber } from "ng-zorro-antd/core/util";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private projectDashboardService: ProjectDashboardService) {
  }

  ngOnInit(): void {
    forkJoin([this.getAllProjects("60566f64706e40a26711c82a")]).subscribe(() => this.processContent());
    console.log(this.router.url);
  }

  // Attributes
  QAButtonSize: NzButtonSize = 'default';

  // Sort functions
  sortColumnProject = (a: Project, b: Project) => a.name.localeCompare(b.name);

  // Data lists
  listOfProjects: Project[];
  listOfProjectUsers: Map<number, ProjectUser[]>;
  listOfIssues: Map<number, Issue[]>;
  listOfDashboardContent: ProjectDashboardContent[];

  // TODO: Create Function for Quickactions Routing
  // TODO: Stash Project Properties for retrieving in settings

  private processContent() {
    console.log(this.listOfProjects);
    console.log(this.listOfIssues);
    this.listOfDashboardContent = this.listOfProjects.map(project => {
      const issues: Issue[] = this.listOfIssues.get(project.id);

      return {
        id: project.id,
        name: project.name,
        customer: this.listOfProjectUsers.get(project.id).filter(
          user => user.roles.some(role => role.name == "customer"))[0].user,
        issues: issues.length,
        issuesOpen: issues.filter(issue => issue.state.phase != "done").length
      }
    });
  }

  // Getters
  private getAllProjects(companyId: string): Observable<any> {
    return this.projectDashboardService.getProjects(companyId).pipe(
      tap(data => this.listOfProjects = data),
      switchMap((projects: Project[]) => {
        const projectIds = projects.map(p => p.id);
        const projectUser = projectIds.map(id => this.getProjectUsers(id));
        return forkJoin(projectUser);
      }),
      switchMap((projects: Project[]) => {
        const projectIds = projects.map(p => p.id);
        const projectIssues = projectIds.map(id => this.getAllIssues());
        return forkJoin(projectIssues);
      })
    );
  }

  private getAllRessources() {

  }

  private getProjectUsers(projectId: number): Observable<any> {
    return this.projectDashboardService.getProjectUsers(projectId).pipe(
      tap(data => this.listOfProjectUsers.set(projectId, data))
    );
  }

  private getAllIssues(): Observable<any> {
    return this.projectDashboardService.getIssues().pipe(
      tap(data => this.listOfIssues = data)
    );
  }
}
