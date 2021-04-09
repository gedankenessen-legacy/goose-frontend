import { Component, OnInit } from '@angular/core';
import { IssueAssignedUser } from "../../interfaces/issue/IssueAssignedUser";
import { IssueAssignedUsersService } from "../issue-assigned-users.service";
import { forkJoin, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-issue-assigned',
  templateUrl: './issue-assigned.component.html',
  styleUrls: ['./issue-assigned.component.less']
})
export class IssueAssignedComponent implements OnInit {
  constructor(private route: ActivatedRoute, private assignedService: IssueAssignedUsersService) { }

  issueId: string;

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    forkJoin([this.getAssignedUser(this.issueId)]).subscribe();
  }

  // Attributes
  assignedUsers: IssueAssignedUser[];

  // Getters
  private getAssignedUser(issueId: string): Observable<IssueAssignedUser[]> {
    return this.assignedService.getAssignedUsers(issueId).pipe(
      tap(assignedUsers => this.assignedUsers = assignedUsers)
    );
  }

  removeAssignedUser(userId: string) {
    this.assignedUsers = this.assignedUsers.filter(user => user['id'].localeCompare(userId) != 0); // Remove User from Cardboard
    this.assignedService.deleteAssignedUser(this.issueId, userId).subscribe(); // Remove User from DB
  }
}
