import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import project from '../../interfaces/project/Project';
import ProjectDashboardContent from '../../interfaces/project/ProjectDashboardContent';
import User from "../../interfaces/User";
import ProjectUser from "../../interfaces/project/ProjectUser";
import Issue from "../../interfaces/issue/Issue";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  // Attributes
  QAButtonSize: NzButtonSize = 'default';

  // Sort functions
  sortColumnProject = (a: project, b: project) => a.name.localeCompare(b.name);

  // Data lists
  listOfProjects: project[];
  listOfIssues: Issue[];
  listOfDashboardContent: ProjectDashboardContent[] = [];

  private processContent() {
    let content: ProjectDashboardContent;
    let users: ProjectUser[];
    let user: User

    for (const project of this.listOfProjects) {
      // Get User with the role Customer
      users = project.users.filter(user => user.roles.some(role => role.name == "customer"));
      if (users.length != 1) { // Error Case
        user = {
          id: -1,
          firstname: "",
          lastname: ""
        };
      } else {
        user = users[0].user;
      }

      content = {
        name: project.name,
        customer: user,
        issues: this.listOfIssues.filter(
          issue => issue.projectId == project.id).length,
        issuesOpen: this.listOfIssues.filter(
          issue => issue.projectId == project.id && issue.state.phase != "done").length
      }

      this.listOfDashboardContent = [...this.listOfDashboardContent, content];
    }
  }

  // Getters
  private getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data) => {
        this.listOfProjects = data;

        // Get all Issues
        this.getAllIssues();
        // this.processContent();
      },
      (error) => {
        console.error(error);
      })
  }

  private getAllIssues() {
    this.projectService.getIssues().subscribe(
      (data) => {
        this.listOfIssues = data;
        this.processContent();
      },
      (error) => {
        console.error(error);
      })
  }
}
