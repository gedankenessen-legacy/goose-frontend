import { Component, OnInit } from '@angular/core';
import { IssueAssignedUser } from "../../interfaces/issue/IssueAssignedUser";
import { IssueAssignedUsersService } from "../issue-assigned-users.service";
import { forkJoin, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";
import { ProjectUser } from "../../interfaces/project/ProjectUser";
import { ProjectUserService } from "../../project/project-user.service";

@Component({
  selector: 'app-issue-assigned',
  templateUrl: './issue-assigned.component.html',
  styleUrls: ['./issue-assigned.component.less']
})
export class IssueAssignedComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private assignedService: IssueAssignedUsersService,
    private projectUserService: ProjectUserService
  ) {
  }

  projectId: string;
  issueId: string;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    forkJoin([this.getAssignedUser(this.issueId), this.getProjectUser(this.projectId)]).subscribe();
  }

  // Attributes
  assignedUsers: IssueAssignedUser[];

  inputValue: ProjectUser;
  compareFun = (o1: string, o2: ProjectUser) => {
    return `${o2.user.firstname} ${o2.user.lastname}`.includes(o1);
  };
  listOfProjectUser: ProjectUser[];

  // Getters
  private getAssignedUser(issueId: string): Observable<IssueAssignedUser[]> {
    return this.assignedService.getAssignedUsers(issueId).pipe(
      tap(assignedUsers => this.assignedUsers = assignedUsers.map(value => {
          return {
            user: {
              id: value['id'],
              firstname: value['firstname'],
              lastname: value['lastname'],
              username: value['username']
            }
          };
        })
      )
    );
  }

  private getProjectUser(projectId: string): Observable<ProjectUser[]> {
    let filterRoles = (value) => {
      return value.name.localeCompare("Firma") != 0 && value.name.localeCompare("Kunde") != 0
    }

    return this.projectUserService.getProjectUsers(projectId).pipe(
      tap(projectUsers => this.listOfProjectUser = projectUsers.filter(
        user => user.roles.some(value => filterRoles(value))
      ))
    );
  }

  removeAssignedUser(userId: string) {
    this.assignedUsers = this.assignedUsers.filter(user => user.user.id.localeCompare(userId) != 0); // Remove User from Cardboard
    this.assignedService.deleteAssignedUser(this.issueId, userId).subscribe(); // Remove User from DB
  }

  addAssignedUser() {
    if (typeof this.inputValue === "string") // TODO: Kein User ausgewählt (Benachrichtigung an Benutzer)
      return;

    let newUser: IssueAssignedUser = {user: this.inputValue.user};
    this.inputValue = null;

    if (this.assignedUsers.some(user => user.user.id.localeCompare(newUser.user.id) == 0)) // TODO: User bereits Assigned (Benachrichtigung an Benutzer)
      return;

    this.assignedUsers = [...this.assignedUsers, newUser]; // Add User to Cardboard
    this.assignedService.updateAssignedUser(this.issueId, newUser.user.id, newUser).subscribe(); // Add User in DB
  }
}
