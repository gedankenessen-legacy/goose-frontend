import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { IssueParent } from '../interfaces/issue/IssueParent';
import { Issue } from '../interfaces/issue/Issue';

@Injectable({
  providedIn: 'root',
})
export class IssueParentService {
  basicPath: string = '/parent';
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

  getParent(issueId: string): Observable<Issue> {
    return this.httpClient
      .get<Issue>(this.getURL(issueId), this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  setParent(issueId: string, parentissueId: string): Observable<any> {
    return this.httpClient
      .put<any>(this.getURL(issueId) + '/' + parentissueId, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  updateParent(
    issueId: string,
    parentId: string,
    newParent: IssueParent
  ): Observable<IssueParent> {
    return this.httpClient
      .put<IssueParent>(
        `${this.getURL(issueId)}/${parentId}`,
        newParent,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  deleteAssignedUser(issueId: string): Observable<any> {
    return this.httpClient
      .delete(`${this.getURL(issueId)}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getChildren(issueId: string, parameters?: {}): Observable<Issue[]> {
    return this.httpClient
      .get<Issue[]>(`${this.base.getUrl}/issues/${issueId}/children`, {
        ...this.httpOptions,
        params: parameters,
      })
      .pipe(catchError(this.base.errorHandle));
  }
}
