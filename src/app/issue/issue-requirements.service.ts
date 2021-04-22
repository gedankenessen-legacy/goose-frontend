import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { IssueRequirement } from '../interfaces/issue/IssueRequirement';
import { AuthService } from '../auth/auth.service';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class IssueRequirementsService {
  basicPath: string = '/requirements';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private router: Router,
    private base: BaseService,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  currentUser: User;

  private getURL(issueId: string): string {
    console.log(`${this.base.getUrl}/issues/${issueId}${this.basicPath}`);
    return `${this.base.getUrl}/issues/${issueId}${this.basicPath}`;
  }

  getRequirements(issueId: string): Observable<IssueRequirement[]> {
    return this.httpClient
      .get<IssueRequirement[]>(this.getURL(issueId), this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getRequirement(
    issueId: string,
    requirementId: string
  ): Observable<IssueRequirement> {
    return this.httpClient
      .get<IssueRequirement>(
        `${this.getURL(issueId)}/${requirementId}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createRequirement(
    issueId: string,
    newRequirement: IssueRequirement
  ): Observable<IssueRequirement> {
    return this.httpClient
      .post<IssueRequirement>(
        this.getURL(issueId),
        newRequirement,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateRequirement(
    issueId: string,
    requirementId: string,
    newRequirement: IssueRequirement
  ): Observable<IssueRequirement> {
    return this.httpClient
      .put<IssueRequirement>(
        `${this.getURL(issueId)}/${requirementId}`,
        newRequirement,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  deleteRequirement(issueId: string, requirementId: string): Observable<any> {
    return this.httpClient
      .delete(`${this.getURL(issueId)}/${requirementId}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }
}
