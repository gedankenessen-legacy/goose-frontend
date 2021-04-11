import { Component, OnInit } from '@angular/core';
import { User } from "../../interfaces/User";
import { State } from "../../interfaces/project/State";
import { ProjectService } from "../project.service";
import { ActivatedRoute, Router } from "@angular/router";
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private projectUserService: ProjectUserService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    const projectId = this.route.snapshot.paramMap.get('projectId');

    this.project.company_id = companyId;

    if (projectId !== null) {
      forkJoin([this.getUsers(), this.getProject(companyId, projectId), this.getProjectUser(projectId)]).subscribe();
    } else
      forkJoin([this.getUsers()]).subscribe();
  }

  // Column Sort functions
  sortColumnName = (a: User, b: User) => a.lastname.localeCompare(b.lastname);

  // Project attributes
  project: Project = {id: "", name: ""};
  customer: ProjectUser;

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
  compareCustomerInput = (o1: string | User, o2: User) => {
    if (!o1) return false;

    // Compare strings
    if (typeof o1 === "string")
      return `${o2.firstname} ${o2.lastname}`.toLowerCase().includes(o1.toLowerCase());

    // Compare Objects
    return o1.id.localeCompare(o2.id) == 0;
  };

  // Employee functions
  removeEmployee() {
  }

  // CustomStates functions
  deleteCustomState(id) {
  }

  addCustomState() {
  }

  // Getters
  private getProject(companyId: string, projectId: string): Observable<any> {
    return this.projectService.getProject(companyId, projectId).pipe(
      tap(projects => this.project = projects)
    );
  }

  private getProjectUser(projectId: string): Observable<any> {
    return this.projectUserService.getProjectUsers(projectId).pipe(
      tap(users => {
        this.customer = users.filter(u => u.roles.some(v => v.name.localeCompare("Kunde") == 0))[0];
        this.userInput = this.customer.user;
      })
    );
  }

  private getUsers(): Observable<any> {
    return this.userService.getUsers().pipe(
      tap(users => this.listOfUsers = users)
    );
  }

  // TODO Rollen vom Server holen um Korrekte Kunden Rolle zu finden
  // private getRoles(): Observable<any> {
  //   return
  // }

  sendForm() {
    console.log(this.userInput);
    if (!this.userInput) return;

    // Post/Update Project
    if (this.project.id !== "") {
      this.projectService.updateProject(this.project.company_id, this.project.id, this.project).subscribe();
      console.log("Project Update")
    } else {
      this.projectService.createProject(this.project.company_id, this.project).subscribe();
      console.log("Project Post")
    }

    // Post/Update Customer(ProjectUser)
    if (this.customer.user.id.localeCompare(this.userInput.id) == 0) { // Customer didnt changed
      console.log("Customer not changed")
      // this.router.navigateByUrl(`${this.project.company_id}/projects`).then();
      return;
    }

    let newCustomer: ProjectUser = {
      user: this.userInput,
      // TODO gegen Rolle aus der db austauschen statt Hardcoden
      roles: [{
        id: "605cc95dd37ccd8527c2ead7",
        name: "Kunde"
      }]
    };

    // this.projectUserService.

    // this.router.navigateByUrl(`${this.project.company_id}/projects`).then();
  }
}
