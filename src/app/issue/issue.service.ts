import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { Issue } from '../interfaces/issue/Issue';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  basicPath: string = '/issues';
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

  private getURL(projectId: string): string {
    return `${this.base.getUrl}/projects/${projectId}${this.basicPath}`;
  }

  getIssues(projectId: string): Observable<Issue[]> {
    return this.httpClient
      .get<Issue[]>(this.getURL(projectId), this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getIssue(projectId: string, issueId: string): Observable<Issue> {
    return this.httpClient
      .get<Issue>(`${this.getURL(projectId)}/${issueId}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  createIssue(projectId: string, newIssue: Issue): Observable<Issue> {
    return this.httpClient
      .post<Issue>(this.getURL(projectId), newIssue, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  updateIssue(
    projectId: string,
    issueId: string,
    newIssue: Issue
  ): Observable<Issue> {
    return this.httpClient
      .put<Issue>(
        `${this.getURL(projectId)}/${issueId}`,
        newIssue,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
