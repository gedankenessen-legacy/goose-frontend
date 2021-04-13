import { Component, OnInit } from '@angular/core';
import { User } from "../../interfaces/User";
import { State } from "../../interfaces/project/State";
import { ProjectService } from "../project.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../user.service";
import { forkJoin, Observable, ObservableInput } from "rxjs";
import { tap } from "rxjs/operators";
import { Project } from "../../interfaces/project/Project";
import { ProjectUserService } from "../project-user.service";
import { ProjectUser } from "../../interfaces/project/ProjectUser";
import { SubscriptionWrapper } from "../../SubscriptionWrapper";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends SubscriptionWrapper implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private projectUserService: ProjectUserService,
    private userService: UserService
  ) {
    super();
  }

  companyId: string;
  projectId: string;

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');

    this.project.company_id = this.companyId;

    let resources: ObservableInput<any>[] = [this.getUsers()];
    if (this.projectId !== null)
      resources = [...resources, this.getProject(this.companyId, this.projectId), this.getProjectUser(this.projectId)];

    this.subscribe(forkJoin(resources));
  }

  // Column Sort functions
  sortColumnName(a: User, b: User): any {
    return a.lastname.localeCompare(b.lastname);
  }

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
  compareCustomerInput(o1: string | User, o2: User): boolean {
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
        this.userInput = this.customer?.user;
      })
    );
  }

  private getUsers(): Observable<any> {
    return this.userService.getUsers().pipe(
      tap(users => this.listOfUsers = users)
    );
  }

  sendForm() {
    if (!this.userInput || this.project.name === "") return;

    // Update Project
    if (this.project.id !== "") {
      this.subscribe(this.projectService.updateProject(this.companyId, this.project.id, this.project));

      // Delete Old Customer and create new Customer
      if (this.customer)
        this.subscribe(this.projectUserService.deleteProjectUser(this.project.id, this.customer?.user.id), () => this.updateUser());
    }

    // Post New Project
    this.subscribe(this.projectService.createProject(this.companyId, this.project), () => this.routeToProjectDashboard(this.companyId));
  }

  updateUser() {
    // Create new customer
    let newCustomer: ProjectUser = {
      user: this.userInput,

      // TODO gegen Rolle aus der db austauschen statt Hardcoden
      roles: [{
        id: "605cc95dd37ccd8527c2ead7",
        name: "Kunde"
      }]
    };

    this.subscribe(this.projectUserService.updateProjectUser(this.project.id, newCustomer.user.id, newCustomer), () => this.routeToProjectDashboard(this.companyId));
  }

  routeToProjectDashboard(companyId: string) {
    this.router.navigateByUrl(`${companyId}/projects`).then();
  }
}
