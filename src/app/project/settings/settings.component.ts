import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/User';
import { State } from '../../interfaces/project/State';
import { ProjectService } from '../project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, ObservableInput } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Project } from '../../interfaces/project/Project';
import { ProjectUserService } from '../project-user.service';
import { ProjectUser } from '../../interfaces/project/ProjectUser';
import { SubscriptionWrapper } from '../../SubscriptionWrapper';
import { CompanyUser } from '../../interfaces/company/CompanyUser';
import { CompanyUserService } from '../../company/company-user.service';
import { Role } from '../../interfaces/Role';
import { RoleService } from 'src/app/role.service';
import { StateService } from '../state.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SettingsComponent extends SubscriptionWrapper implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private projectUserService: ProjectUserService,
    private companyUserService: CompanyUserService,
    private roleService: RoleService,
    private stateService: StateService,
    private modal: NzModalService,
    private authService: AuthService
  ) {
    super();
  }

  companyId: string;
  projectId: string;
  loggedInUserRoles: Role[];

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');

    this.project.company_id = this.companyId;

    let resources: ObservableInput<any>[] = [
      this.getCompanyUsers(this.companyId),
      this.getRoles(),
    ];
    if (this.projectId !== null)
      resources = [
        ...resources,
        this.getProject(this.companyId, this.projectId),
        this.getCustomStates(this.projectId),
      ];

    this.subscribe(forkJoin(resources), () => {
      this.updateCustomerSelectionList();

      if (this.projectId !== null)
        this.subscribe(this.getProjectUser(this.projectId), () => {
          this.updateEmployeeSelectionList();
          // If User has no Permission send him back to the dashboard
          if (
            this.checkUserRole('Kunde') ||
            this.checkUserRole('Mitarbeiter (Lesend)')
          )
            this.routeToProjectDashboard(this.companyId);
        });
      else this.selectedCustomer = undefined;
    });
  }

  checkUserRole(role: string): boolean {
    return this.loggedInUserRoles?.some((r) => r.name === role);
  }

  // Column Sort functions
  sortColumnName(a: ProjectUser, b: ProjectUser): any {
    return a.user.lastname.localeCompare(b.user.lastname);
  }

  listOfRoles: Role[] = [];
  listOfEmployeeRadioValues: Role[] = [];

  // Project attributes
  project: Project = { id: '', name: '' };
  customer: ProjectUser;

  // Customer attributes
  filteredCustomerSelectionList: User[] = [];
  listOfCompanyUsers: CompanyUser[];
  selectedCustomer: User = { firstname: '', id: '', lastname: '' };
  customerRole: Role;

  // Employee attributes
  employeeList: ProjectUser[] = [];
  filteredEmployeeSelectionList: User[] = [];
  newEmployee: User;
  newEmployeeRole: Role = { id: '', name: '' };

  // CustomState attributes
  customStateIn: string;
  selectedPhase: string;
  customStates: State[] = [];
  phaseList: string[] = [
    'Verhandlungsphase',
    'Bearbeitungsphase',
    'Abschlussphase',
  ];

  // Customer functions
  compareCustomerInput(o1: string | User, o2: User): boolean {
    if (!o1) return false;

    // Compare strings
    if (typeof o1 === 'string')
      return `${o2.firstname} ${o2.lastname}`
        .toLowerCase()
        .includes(o1.toLowerCase());

    // Compare Objects
    return o1.id.localeCompare(o2.id) == 0;
  }

  private updateCustomerSelectionList(): void {
    this.filteredCustomerSelectionList = this.listOfCompanyUsers
      .filter((v) => v.roles.some((s) => s.name === 'Kunde'))
      .map((user) => user.user);
  }

  // Employee functions
  removeEmployee(userId: string) {
    this.employeeList = this.employeeList.filter((v) => v.user.id !== userId); // Delete Employee from local list
    this.subscribe(
      this.projectUserService.deleteProjectUser(this.projectId, userId)
    ); // Delete Employee from DB
    this.updateEmployeeSelectionList();
  }

  employeeRightsChanged(employee: ProjectUser) {
    this.subscribe(
      this.projectUserService.deleteProjectUser(
        this.projectId,
        employee.user.id
      ), // Delete Employee from DB
      () =>
        this.subscribe(
          this.projectUserService.updateProjectUser(
            this.projectId,
            employee.user.id,
            employee
          )
        )
    ); // Add Employee to DB
  }

  addEmployee() {
    if (!this.newEmployee || this.newEmployeeRole.id === '') {
      this.modal.error({
        nzTitle: 'Error beim hinzufügen eines Mitarbeiters',
        nzContent: 'Bitte füllen Sie alle Felder aus (Mitarbeiter + Rechte)',
      });
      return;
    }

    if (
      this.checkForProjectManager(this.newEmployee?.id) &&
      this.newEmployeeRole.id === this.listOfEmployeeRadioValues[2].id
    ) {
      this.modal.error({
        nzTitle: 'Error beim hinzufügen eines Mitarbeiters',
        nzContent: 'Es gibt bereits einen Projektleiter',
      });
      return;
    }

    let newEmployee: ProjectUser = {
      user: this.newEmployee,
      roles: [{ id: this.newEmployeeRole.id, name: '' }],
    };

    // Reset input fields
    this.newEmployee = undefined;
    this.newEmployeeRole = { id: '', name: '' };

    // Add Employee to DB
    this.subscribe(
      this.projectUserService.updateProjectUser(
        this.projectId,
        newEmployee.user.id,
        newEmployee
      )
    );
    this.employeeList = [...this.employeeList, newEmployee]; // Add Employee to local list

    this.updateEmployeeSelectionList();
  }

  checkForProjectManager(userId: string): boolean {
    return this.employeeList?.some(
      (e) =>
        e?.user.id !== userId &&
        e.roles.some((r) => r.id === this.listOfEmployeeRadioValues[2].id)
    );
  }

  private updateEmployeeSelectionList(): void {
    this.filteredEmployeeSelectionList = this.listOfCompanyUsers
      .filter(
        (v) =>
          v.roles.some((s) => s.name !== 'Kunde' && s.name !== 'Firma') &&
          !this.employeeList?.some((s) => s.user.id === v.user.id)
      )
      .map((user) => user.user);
  }

  // CustomStates functions
  deleteCustomState(stateId: string) {
    this.customStates = this.customStates.filter((s) => s.id !== stateId); // Delete State from local list
    this.subscribe(this.stateService.deleteState(this.projectId, stateId)); // Delete State in DB
  }

  startEditCustomState(state: State) {
    state['edit'] = true;
    state['tempName'] = state.name;
  }

  editCustomState(state: State) {
    state['edit'] = false;
    state.name = state['tempName'];

    this.subscribe(
      this.stateService.updateState(this.projectId, state.id, state)
    );
  }

  addCustomState() {
    if (!this.customStateIn || !this.selectedPhase) {
      this.modal.error({
        nzTitle: 'Error beim hinzufügen eines Status',
        nzContent: 'Bitte füllen Sie alle Felder aus (Statusname + Phase)',
      });
      return;
    }

    let newState: State = {
      name: this.customStateIn,
      phase: this.selectedPhase,
      userGenerated: true,
    };

    // Reset input fields
    this.customStateIn = '';
    this.selectedPhase = '';

    // Add State to DB
    this.subscribe(
      this.stateService.createState(this.projectId, newState).pipe(
        // Add State to local list
        tap((state) => (this.customStates = [...this.customStates, state]))
      )
    );
  }

  // Getters
  private getProject(
    companyId: string,
    projectId: string
  ): Observable<Project> {
    return this.projectService
      .getProject(companyId, projectId)
      .pipe(tap((projects) => (this.project = projects)));
  }

  private getProjectUser(projectId: string): Observable<ProjectUser[]> {
    return this.projectUserService.getProjectUsers(projectId).pipe(
      tap((users) => {
        this.loggedInUserRoles = users.find(
          (v) => v.user.id === this.authService.currentUserValue.id
        )?.roles;

        // Get Current Customer
        this.customer = users.filter((u) =>
          u.roles.some((r) => r.name === 'Kunde')
        )[0];
        this.selectedCustomer = this.customer?.user;

        // Get Employees
        this.employeeList = users.filter((u) =>
          u.roles.some(
            (r) =>
              r.name === 'Mitarbeiter (Lesend)' ||
              r.name === 'Mitarbeiter' ||
              r.name === 'Projektleiter'
          )
        );
      })
    );
  }

  private getCompanyUsers(companyId: string): Observable<CompanyUser[]> {
    return this.companyUserService.getCompanyUsers(companyId).pipe(
      tap((users) => {
        this.listOfCompanyUsers = users;
      })
    );
  }

  private getCustomStates(projectId: string): Observable<State[]> {
    return this.stateService
      .getStates(projectId)
      .pipe(
        tap(
          (states) =>
            (this.customStates = states.filter((v) => v.userGenerated))
        )
      );
  }

  private getRoles(): Observable<any> {
    return this.roleService.getRoles().pipe(
      tap((roles) => {
        this.listOfEmployeeRadioValues[0] = roles.filter(
          (v) => v.name === 'Mitarbeiter (Lesend)'
        )[0];
        this.listOfEmployeeRadioValues[1] = roles.filter(
          (v) => v.name === 'Mitarbeiter'
        )[0];
        this.listOfEmployeeRadioValues[2] = roles.filter(
          (v) => v.name === 'Projektleiter'
        )[0];
        this.customerRole = roles.filter((v) => v.name === 'Kunde')[0];
        this.listOfRoles = roles;
      })
    );
  }

  // Submit functions
  sendForm() {
    if (!this.selectedCustomer || this.project.name === '') {
      this.modal.error({
        nzTitle: 'Error beim Erstellen/Updaten eines Projektes',
        nzContent: 'Bitte füllen Sie alle Felder aus (Projektname + Kunde)',
      });
      return;
    }

    // Update Project
    if (this.project.id !== '') {
      this.subscribe(
        this.projectService.updateProject(
          this.companyId,
          this.project.id,
          this.project
        ),
        () => {
          // End function if the customer didn't changed;
          if (this.customer?.user.id === this.selectedCustomer.id) {
            this.routeToProjectDashboard(this.companyId);
            return;
          }

          // Delete Old Customer and create new Customer
          if (this.customer) {
            this.subscribe(
              this.projectUserService.deleteProjectUser(
                this.project.id,
                this.customer?.user.id
              ),
              () => this.updateCustomer(this.project.id).subscribe()
            );
            return;
          }
          this.updateCustomer(this.project.id).subscribe();
        }
      );

      return;
    }

    // Post New Project
    this.subscribe(
      this.projectService.createProject(this.companyId, this.project).pipe(
        switchMap((project) => {
          this.project.id = project.id;

          return forkJoin([
            this.updateCompanyUser(project.id),
            this.updateCustomer(project.id),
          ]);
        }),
        tap(() => this.routeToProjectDashboard(this.companyId))
      )
    );
  }

  updateCompanyUser(projectId: string): Observable<ProjectUser> {
    // Add Company Account to ProjectUser
    let companyAcc: ProjectUser = {
      user: {
        id: this.authService.currentUserValue.id,
        username: this.authService.currentUserValue.username,
        lastname: this.authService.currentUserValue.lastname,
        firstname: this.authService.currentUserValue.firstname,
      },
      roles: [this.listOfRoles.find((v) => v.name === 'Firma')],
    };

    return this.projectUserService.updateProjectUser(
      projectId,
      companyAcc.user.id,
      companyAcc
    );
  }

  updateCustomer(projectId: string): Observable<ProjectUser> {
    // Create new customer
    let newCustomer: ProjectUser = {
      user: this.selectedCustomer,
      roles: [this.customerRole],
    };

    return this.projectUserService.updateProjectUser(
      projectId,
      newCustomer.user.id,
      newCustomer
    );
  }

  routeToProjectDashboard(companyId: string) {
    this.router.navigateByUrl(`${companyId}/projects`).then();
  }
}
