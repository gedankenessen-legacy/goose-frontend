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

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private projectUserService: ProjectUserService, private userService: UserService) { }

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    const projectId = this.route.snapshot.paramMap.get('projectId');

    console.log(companyId);
    console.log(projectId);

    this.project.company_id = companyId;

    if (projectId !== null) {
      forkJoin([this.getUsers(), this.getProject(companyId, projectId)]).subscribe();
    } else
      forkJoin([this.getUsers()]).subscribe();
  }

  // Sort functions
  sortColumnName = (a: User, b: User) => a.lastname.localeCompare(b.lastname);

  // Attributes
  QAButtonSize: 'default';
  project: Project = {name: ""};
  customer: ProjectUser;
  filteredListOfUsers: string[] = [];

  // Data lists

  // customer
  selectedCustomer: User;
  listOfUsers: User[];
  userInput: string = '';
  onChange(value: string): void {
    this.filteredListOfUsers = [];

    this.listOfUsers.filter(option => {
      let string = option.firstname + ' ' + option.lastname;
      return string.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }).forEach(user => this.filteredListOfUsers.push(user.firstname + ' ' + user.lastname));
  }

  // employees
  employeeList: any;
  radioValueUserRights: any;

  // States
  customStateIn: string;
  selectedPhase: string;
  customStates: State[];
  phaseList: string[] = ["Verhandlungsphase", "Bearbeitungsphase", "Abschlussphase"];

  // Getters
  private getProject(companyId: string, projectId: string): Observable<any>  {
    return this.projectService.getProject(companyId, projectId).pipe(
      tap(projects => this.project = projects)
    );
  }

  private getUsers(): Observable<any>  {
    return this.userService.getUsers().pipe(
      tap(users => {
        this.listOfUsers = users;
        this.onChange(this.userInput);
      })
    );
  }


  deleteCustomState(id) {
    // return;

    // Delete elem
    let pos = this.customStates.findIndex(state => state.id == id);
    this.customStates = this.customStates.slice(pos, 1);
  }

  addCustomState() {
    // return;

    let elem: State = {
      name: this.customStateIn,
      phase: this.selectedPhase
    }

    // Post elem
    // Get elem
    // Add elem to list
  }

  sendForm() {
    let customer: User = {
      firstname: this.userInput.substring(0, this.userInput.indexOf(' ')),
      lastname: this.userInput.substring(this.userInput.indexOf(' ')+1)
    }
    console.log(customer)
    console.log(this.project);
    // if (this.project.id !== undefined)
    //   this.projectService.updateProject(this.project.company_id, this.project.id, this.project);
    // else
    //   this.projectService.createProject(this.project.company_id, this.project);
  }

  onSearch($event: string) {

  }

  test() {

  }


}
