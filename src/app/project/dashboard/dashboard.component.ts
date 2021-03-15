import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import project from '../../interfaces/Project';
import DashboardContent from '../../interfaces/project/DashboardContent';
import User from "../../interfaces/User";
import ProjectUser from "../../interfaces/ProjectUser";

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
  listOfTickets: any[];
  listOfDashboardContent: DashboardContent[] = [];

  private processContent() {
    let content: DashboardContent;
    let users: ProjectUser[];
    let user: User

    for (const project of this.listOfProjects) {
      // Get all Users with the role Customer
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
        issues: 0,
        issuesOpen: 0

        // issues: this.listOfTickets.filter(
        //   ticket => ticket.projectId == project.id).length,
        //
        // issuesOpen: this.listOfTickets.filter(
        //   ticket => ticket.projectId == project.id && ticket.state.phase != "done").length
      }

      this.listOfDashboardContent = [...this.listOfDashboardContent, content];
    }
  }

  // Getters
  private getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data) => {
        this.listOfProjects = data;

        // Get all Tickets
        // this.getAllTickets();
        this.processContent();
      },
      (error) => {
        console.error(error);
      })
  }

  private getAllTickets() {
    this.projectService.getTickets().subscribe(
      (data) => {
        this.listOfTickets = data;
        this.processContent();
      },
      (error) => {
        console.error(error);
      })
  }
}
