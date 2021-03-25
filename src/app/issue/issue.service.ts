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
  ) { }

  private getURL(companyId: string): string {
    return `${this.base.getUrl}/projects/${companyId}${this.basicPath}`;
  }

  getIssues(companyId: string): Observable<Issue[]> {
    return this.httpClient
      .get<Issue[]>(this.getURL(companyId), this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getIssue(companyId: string, issueId: string): Observable<Issue> {
    return this.httpClient
      .get<Issue>(`${this.getURL(companyId)}/${issueId}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  createIssue(companyId: string, newIssue: Issue): Observable<Issue> {
    return this.httpClient
      .post<Issue>(this.getURL(companyId), newIssue, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  updateIssue(companyId: string, issueId: string, newIssue: Issue): Observable<Issue> {
    return this.httpClient
      .put<Issue>(
        `${this.getURL(companyId)}/${issueId}`,
        newIssue,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
