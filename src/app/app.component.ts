import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Project } from './interfaces/project/Project';
import { ProjectService } from './project/project.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'Goose';
  collapsed = false;

  projects: Project[] = [];
  companyId: string;

  constructor(
    public authService: AuthService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.collapsed =
      JSON.parse(localStorage.getItem('sidebar_collapse')) ?? false;
    this.projectService
      .getProjects(this.companyId)
      .subscribe((data) => (this.projects = data));
    this.companyId =
      JSON.parse(localStorage.getItem('companies'))?.length > 0
        ? JSON.parse(localStorage.getItem('companies'))[0]?.id
        : '';
  }

  saveCollapse(collapse: boolean): void {
    localStorage.setItem('sidebar_collapse', JSON.stringify(collapse));
  }
}
