import { Injectable } from '@angular/core';
import { ProjectService } from "./project.service";
import { IssueService } from "../issue/issue.service";
import { Observable } from "rxjs";
import { ProjectUserService } from "./project-user.service";
import { Project } from "../interfaces/project/Project";

@Injectable({
  providedIn: 'root'
})
export class ProjectDashboardService {

  constructor(private projectService: ProjectService, private projectUserService: ProjectUserService, private issueService: IssueService) {}

  getProjects(companyId: string): Observable<Project[]> {
    return this.projectService.getProjects(companyId);
  }

  getProjectUsers(projectId: string): Observable<any> {
    return this.projectUserService.getProjectUsers(projectId);
  }

  getIssues(project): Observable<any> {
    return this.issueService.getIssues();
  }
}
