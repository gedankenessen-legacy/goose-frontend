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

  /**
   * Erhalte alle Issues eines Projektes
   * @param projectId Id des Projektes in dem sich Issue befindet
   * @param parameters Optionen welche zusätzliche Inhalte beinhaltet werden (z.B. `{getParent:true}` um auch Parent zu erhalten)
   * @return `Observable` von `Issues[]`
   */
  getIssues(projectId: string, parameters?: {}): Observable<Issue[]> {
    return this.httpClient
      .get<Issue[]>(this.getURL(projectId), {
        ...this.httpOptions,
        params: parameters,
      })
      .pipe(catchError(this.base.errorHandle));
  }

  /**
   * Erhalte Issue eines Projektes anhand von Id
   * @param projectId Id des Projektes in dem sich Issue befindet
   * @param issueId Id des Issues
   * @param parameters Optionen welche zusätzliche Inhalte beinhaltet werden (z.B. `{getParent:true}` um auch Parent zu erhalten)
   * @return `Observable` von `Issues`
   */
  getIssue(
    projectId: string,
    issueId: string,
    parameters?: {}
  ): Observable<Issue> {
    return this.httpClient
      .get<Issue>(`${this.getURL(projectId)}/${issueId}`, {
        ...this.httpOptions,
        params: parameters,
      })
      .pipe(catchError(this.base.errorHandle));
  }

  // TODO createIssue(companyId: string, newIssue: Issue) ist nicht möglich mit Backend Anforderungen
  createIssue(projectId: string, newIssue: any): Observable<Issue> {
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
