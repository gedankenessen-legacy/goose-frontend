import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { IssueAssignedUser } from '../interfaces/issue/IssueAssignedUser';

@Injectable({
  providedIn: 'root',
})
export class IssueAssignedUsersService {
  basicPath: string = '/users';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private router: Router,
    private base: BaseService,
    private httpClient: HttpClient
  ) {}

  private getURL(issueId: string): string {
    return `${this.base.getUrl}/issues/${issueId}${this.basicPath}`;
  }

  getAssignedUsers(issueId: string): Observable<IssueAssignedUser[]> {
    return this.httpClient
      .get<IssueAssignedUser[]>(this.getURL(issueId), this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getAssignedUser(
    issueId: string,
    userId: string
  ): Observable<IssueAssignedUser> {
    return this.httpClient
      .get<IssueAssignedUser>(
        `${this.getURL(issueId)}/${userId}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  // createUser(
  //   issueId: string,
  //   newUser: IssueAssignedUser
  // ): Observable<IssueAssignedUser> {
  //   return this.httpClient
  //     .post<IssueAssignedUser>(
  //       this.getURL(issueId),
  //       newUser,
  //       this.httpOptions
  //     )
  //     .pipe(catchError(this.base.errorHandle));
  // }

  updateAssignedUser(
    issueId: string,
    userId: string,
    newUser: IssueAssignedUser
  ): Observable<IssueAssignedUser> {
    return this.httpClient
      .put<IssueAssignedUser>(
        `${this.getURL(issueId)}/${userId}`,
        newUser,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  deleteAssignedUser(issueId: string, userId: string): Observable<any> {
    return this.httpClient
      .delete(`${this.getURL(issueId)}/${userId}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }
}
