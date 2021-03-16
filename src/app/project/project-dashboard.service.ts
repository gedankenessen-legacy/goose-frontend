import { Injectable } from '@angular/core';
import { ProjectService } from "./project.service";
import { IssueService } from "../issue/issue.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectDashboardService {

  constructor(private projectService: ProjectService, private issueService: IssueService) {}

  getProjects(): Observable<any> {
    return this.projectService.getProjects();
  }

  getIssues(): Observable<any> {
    return this.issueService.getIssues();
  }
}
