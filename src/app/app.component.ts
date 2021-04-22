import { Component, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Project } from './interfaces/project/Project';
import { IssueService } from './issue/issue.service';
import { ProjectService } from './project/project.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Goose';
  collapsed = false;

  projects: Project[] = [];
  companyId: string;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private projectService: ProjectService) {
  }

  ngOnInit() {
    this.collapsed = JSON.parse(localStorage.getItem('sidebar_collapse')) ?? false;
    this.projectService.getProjects(this.companyId).subscribe(data => this.projects = data);
    // TODO: Update nach URL change
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.companyId = "6070895a53608b0ba47360f1";
  }

  saveCollapse(collapse: boolean): void {
    localStorage.setItem('sidebar_collapse', JSON.stringify(collapse));
  }
}
