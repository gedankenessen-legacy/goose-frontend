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
import { CompanyUser } from "../../interfaces/company/CompanyUser";
import { CompanyUserService } from "../../company/company-user.service";

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
    private companyUserService: CompanyUserService
  ) {
    super();
  }

  companyId: string;
  projectId: string;

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');

    console.log(this.userInput);

    this.project.company_id = this.companyId;

    let resources: ObservableInput<any>[] = [this.getCompanyUsers()];
    if (this.projectId !== null)
      resources = [...resources, this.getProject(this.companyId, this.projectId)];

    this.subscribe(forkJoin(resources), () => {
      this.updateCustomerSelectionList();
      this.subscribe(this.getProjectUser(this.projectId));
    });
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
  filteredCustomerSelectionList: User[];
  listOfCompanyUsers: CompanyUser[];
  userInput: User = {firstname: "", id: "", lastname: ""};

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

  private updateCustomerSelectionList(): void {
    this.filteredCustomerSelectionList = this.listOfCompanyUsers.map(user => user.user);
  }

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
        this.customer = users.filter(u => u.roles.some(v => v.name === "Kunde"))[0];
        this.userInput = this.customer.user;
      })
    );
  }

  private getCompanyUsers(): Observable<any> {
    return this.companyUserService.getCompanyUsers(this.companyId).pipe(
      tap(users => this.listOfCompanyUsers = users)
    );
  }

  sendForm() {
    if (!this.userInput || this.project.name === "") return;

    // Update Project
    if (this.project.id !== "") {
      this.subscribe(this.projectService.updateProject(this.companyId, this.project.id, this.project));

      // Delete Old Customer and create new Customer
      console.log(this.customer);
      if (this.customer) {
        console.log(true);
        this.subscribe(this.projectUserService.deleteProjectUser(this.project.id, this.customer?.user.id), () => this.updateUser());
        return;
      }
    }

    // Post New Project
    this.subscribe(this.projectService.createProject(this.companyId, this.project), (data) => {
      if (!this.customer) {
        this.project.id = data.id;
        this.updateUser();
      }
      // this.routeToProjectDashboard(this.companyId);
    });
  }

  updateUser() {
    console.log(this.project);
    console.log("user");
    // Create new customer
    let newCustomer: ProjectUser = {
      user: this.userInput,

      // TODO gegen Rolle aus der db austauschen statt Hardcoden
      roles: [{
        id: "605cc95dd37ccd8527c2ead7",
        name: "Kunde"
      }]
    };

    console.log(JSON.stringify(newCustomer));
    this.subscribe(this.projectUserService.updateProjectUser(this.project.id, newCustomer.user.id, newCustomer), () => this.routeToProjectDashboard(this.companyId));
  }

  routeToProjectDashboard(companyId: string) {
    this.router.navigateByUrl(`${companyId}/projects`).then();
  }
}
