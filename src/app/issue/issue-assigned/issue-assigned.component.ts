import { Component, OnInit } from '@angular/core';
import { IssueAssignedUser } from "../../interfaces/issue/IssueAssignedUser";
import { IssueAssignedUsersService } from "../issue-assigned-users.service";
import { forkJoin, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";
import { ProjectUser } from "../../interfaces/project/ProjectUser";
import { ProjectUserService } from "../../project/project-user.service";
import { SubscriptionWrapper } from "../../SubscriptionWrapper";
import * as Identicons from 'identicon.js';

@Component({
  selector: 'app-issue-assigned',
  templateUrl: './issue-assigned.component.html',
  styleUrls: ['./issue-assigned.component.less']
})
export class IssueAssignedComponent extends SubscriptionWrapper implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private assignedService: IssueAssignedUsersService,
    private projectUserService: ProjectUserService
  ) {
    super();
  }

  projectId: string;
  issueId: string;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');

    this.subscribe(forkJoin([this.getAssignedUser(this.issueId), this.getProjectUser(this.projectId)]), () => this.updateSelectionList());
  }

  // Attributes
  listOfAssignedUsers: IssueAssignedUser[];
  listOfProjectUser: ProjectUser[];
  filteredSelectionList: ProjectUser[];
  inputValue: ProjectUser;
  compareUserInput(o1: string | ProjectUser, o2: ProjectUser): boolean {
    if (!o1) return false;

    // Compare strings
    if (typeof o1 === "string")
      return `${o2.user.firstname} ${o2.user.lastname}`.toLowerCase().includes(o1.toLowerCase());

    // Compare Objects
    return o1.user.id.localeCompare(o2.user.id) == 0;
  }

  private updateSelectionList(): void {
    this.filteredSelectionList = this.listOfProjectUser.filter(
      pUser => !this.listOfAssignedUsers.some(value => value.user.id.localeCompare(pUser.user.id) == 0)
    );
  }

  // Getters
  private getAssignedUser(issueId: string): Observable<IssueAssignedUser[]> {
    return this.assignedService.getAssignedUsers(issueId).pipe(
      tap(assignedUsers => this.listOfAssignedUsers = assignedUsers.map(value => {
        return {
          user: {
            id: value['id'],
            firstname: value['firstname'],
            lastname: value['lastname'],
            username: value['username'],
            avatar: `data:image/png;base64,${new Identicons(value['id'], 420).toString()}`
          }
        };
      })
      )
    );
  }

  private getProjectUser(projectId: string): Observable<ProjectUser[]> {
    let filterRoles = (value) => {
      return value.name.localeCompare("Firma") != 0 && value.name.localeCompare("Kunde") != 0;
    }

    return this.projectUserService.getProjectUsers(projectId).pipe(
      tap(projectUsers => this.listOfProjectUser = projectUsers.filter(
        user => user.roles.some(value => filterRoles(value))
      ))
    );
  }

  removeAssignedUser(userId: string) {
    this.listOfAssignedUsers = this.listOfAssignedUsers.filter(user => user.user.id.localeCompare(userId) != 0); // Remove User from Cardboard
    this.subscribe(this.assignedService.deleteAssignedUser(this.issueId, userId)); // Remove User from DB
    this.updateSelectionList();
  }

  addAssignedUser() {
    if (typeof this.inputValue === "string") // TODO: Kein User ausgewählt (Benachrichtigung an Benutzer)
      return;

    let newUser: IssueAssignedUser = { user: this.inputValue.user };
    newUser.user['avatar'] = `data:image/png;base64,${new Identicons(newUser.user.id, 420).toString()}`
    this.inputValue = null;

    if (this.listOfAssignedUsers.some(user => user.user.id.localeCompare(newUser.user.id) == 0)) // TODO: User bereits Assigned (Benachrichtigung an Benutzer)
      return;

    this.listOfAssignedUsers = [...this.listOfAssignedUsers, newUser]; // Add User to Cardboard
    this.subscribe(this.assignedService.updateAssignedUser(this.issueId, newUser.user.id, newUser)); // Add User in DB
    this.updateSelectionList();
  }
}
