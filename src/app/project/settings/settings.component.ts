import { Component, OnInit } from '@angular/core';
import { User } from "../../interfaces/User";
import { State } from "../../interfaces/project/State";
import { ProjectService } from "../project.service";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../user.service";
import { forkJoin, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Project } from "../../interfaces/project/Project";
import { ProjectUserService } from "../project-user.service";
import { ProjectUser } from "../../interfaces/project/ProjectUser";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private projectUserService: ProjectUserService, private userService: UserService) {
  }

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    const projectId = this.route.snapshot.paramMap.get('projectId');

    this.project.company_id = companyId;

    if (projectId !== null) {
      forkJoin([this.getUsers(), this.getProject(companyId, projectId)]).subscribe();
    } else
      forkJoin([this.getUsers()]).subscribe();
  }

  // Column Sort functions
  sortColumnName = (a: User, b: User) => a.lastname.localeCompare(b.lastname);

  // Project attributes
  project: Project = {id: "", name: ""};
  customer: ProjectUser;
  filteredListOfUsers: string[] = [];

  // Customer attributes
  selectedCustomer: User;
  listOfUsers: User[];
  userInput: User;

  // Employee attributes
  employeeList: any;
  radioValueEmployeeRights: any;

  // CustomState attributes
  customStateIn: string;
  selectedPhase: string;
  customStates: State[];
  phaseList: string[] = ["Verhandlungsphase", "Bearbeitungsphase", "Abschlussphase"];

  // Customer functions
  compareCustomer(o1: User | string, o2: User): boolean {
    if (o1) {
      return typeof o1 === 'string' ? o1 === (o2.firstname + ' ' + o2.lastname) : (o1.firstname === o2.firstname && o1.lastname === o2.lastname);
    } else {
      return false;
    }
  };

  onCustomerInputChange(value: string): void {
    this.filteredListOfUsers = [];

    this.listOfUsers.filter(option => {
      let string = option.firstname + ' ' + option.lastname;
      return string.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }).forEach(user => this.filteredListOfUsers.push(user.firstname + ' ' + user.lastname));
  }

  // Employee functions
  removeEmployee() {}

  // CustomStates functions
  deleteCustomState(id) {}
  addCustomState() {}

  // Getters
  private getProject(companyId: string, projectId: string): Observable<any> {
    return this.projectService.getProject(companyId, projectId).pipe(
      tap(projects => this.project = projects)
    );
  }

  private getUsers(): Observable<any> {
    return this.userService.getUsers().pipe(
      tap(users => {
        this.listOfUsers = users;
      })
    );
  }

  sendForm() {
    // Post / Update Project
    if (this.project.id !== "") {
      this.projectService.updateProject(this.project.company_id, this.project.id, this.project).subscribe();
    } else {
      this.projectService.createProject(this.project.company_id, this.project).subscribe();
    }
  }
}
