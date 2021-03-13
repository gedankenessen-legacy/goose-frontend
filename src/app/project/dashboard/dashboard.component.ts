import { Component, OnInit } from '@angular/core';
import project from "../interfaces/Project";
import { ProjectService } from "../project.service";
import { NzButtonSize } from "ng-zorro-antd/button";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.getAllProjects();
  }

  sortColumnProject = (a: project, b: project) => a.name.localeCompare(b.name);
  QAButtonSize: NzButtonSize = 'default';

  listOfProjects: project[];

  getAllProjects() {
    this.projectService.getProject().subscribe(
      (data) => {
        this.listOfProjects = data;
      },
      (error) => {
        console.error(error);
      })
  }

  // Quick Actions
  clickMe(): void {

  }
}
