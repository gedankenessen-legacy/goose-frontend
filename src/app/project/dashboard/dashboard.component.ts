import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { forkJoin, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { Project } from '../../interfaces/project/Project';
import ProjectDashboardContent from '../../interfaces/project/ProjectDashboardContent';
import { Issue } from "../../interfaces/issue/Issue";
import { ActivatedRoute } from "@angular/router";
import { ProjectUser } from "../../interfaces/project/ProjectUser";
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../project-user.service';
import { IssueService } from 'src/app/issue/issue.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  constructor(private router: ActivatedRoute, private projectService: ProjectService, private projectUserService: ProjectUserService, private issueService: IssueService) {
  }

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get('id');
    const DemoId = "60566f64706e40a26711c82a";

    forkJoin([this.getAllResources(id)]).subscribe(() => this.processContent());
    console.log(this.router.url);
  }

  // Attributes
  QAButtonSize: NzButtonSize = 'default';

  // Sort functions
  sortColumnProject = (a: Project, b: Project) => a.name.localeCompare(b.name);

  // Data lists
  listOfProjects: Project[];
  listOfProjectUsers: Map<string, ProjectUser[]> = new Map<string, ProjectUser[]>();
  listOfIssues: Map<string, Issue[]> = new Map<string, Issue[]>();
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
        // issuesOpen: 0
      }
    });
  }

  // Getters
  private getAllResources(companyId: string): Observable<void>  {
    return this.projectService.getProjects(companyId).pipe(
      tap(projects => this.listOfProjects = projects),
      switchMap((projects: Project[]) => {
        const ids = projects.map(project => project.id);

        const projectUser = ids.map(
          id => this.projectUserService.getProjectUsers(id).pipe(tap(projectsUsers => this.listOfProjectUsers.set(id, projectsUsers))));

        const projectIssues = ids.map(
          id => this.issueService.getIssues(id).pipe(tap(projectsIssues => this.listOfIssues.set(id, projectsIssues))));

        return forkJoin([forkJoin(projectUser),forkJoin(projectIssues)]).pipe(map(() => null));
      })
    );
  }
}
