import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { forkJoin, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import project from '../../interfaces/project/Project';
import ProjectDashboardContent from '../../interfaces/project/ProjectDashboardContent';
import Issue from "../../interfaces/issue/Issue";
import { ProjectDashboardService } from "../project-dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  constructor(private projectDashboardService: ProjectDashboardService) {
  }

  ngOnInit(): void {
    forkJoin([this.getAllProjects(), this.getAllIssues()]).subscribe(() => this.processContent());
  }

  // Attributes
  QAButtonSize: NzButtonSize = 'default';

  // Sort functions
  sortColumnProject = (a: project, b: project) => a.name.localeCompare(b.name);

  // Data lists
  listOfProjects: project[];
  listOfIssues: Issue[];
  listOfDashboardContent: ProjectDashboardContent[];

  private processContent() {
    this.listOfDashboardContent = this.listOfProjects.map(project => {
      const issues: Issue[] = this.listOfIssues.filter(issue => issue.projectId == project.id);

      return {
        id: project.id,
        name: project.name,
        customer: project.users.filter(
          user => user.roles.some(role => role.name == "customer"))[0].user,
        issues: issues.length,
        issuesOpen: issues.filter(issue => issue.state.phase != "done").length
      }
    });
  }

  // Getters
  private getAllProjects(): Observable<any> {
    return this.projectDashboardService.getProjects().pipe(
      tap(data => this.listOfProjects = data)
    );
  }

  private getAllIssues(): Observable<any> {
    return this.projectDashboardService.getIssues().pipe(
      tap(data => this.listOfIssues = data)
    );
  }
}
