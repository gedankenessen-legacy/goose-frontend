import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { IssueSuccessor } from '../interfaces/issue/IssueSuccessor';

@Injectable({
  providedIn: 'root',
})
export class IssueSuccessorService {
  basicPath: string = '/successors';
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

  getSuccessors(issueId: string): Observable<IssueSuccessor[]> {
    return this.httpClient
      .get<IssueSuccessor[]>(this.getURL(issueId), this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getSuccessor(
    issueId: string,
    successorId: string
  ): Observable<IssueSuccessor> {
    return this.httpClient
      .get<IssueSuccessor>(
        `${this.getURL(issueId)}/${successorId}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createSuccessor(
    issueId: string,
    newSuccessor: IssueSuccessor
  ): Observable<IssueSuccessor> {
    return this.httpClient
      .post<IssueSuccessor>(
        this.getURL(issueId),
        newSuccessor,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateSuccessor(
    issueId: string,
    successorId: string,
    newSuccessor: IssueSuccessor
  ): Observable<IssueSuccessor> {
    return this.httpClient
      .put<IssueSuccessor>(
        `${this.getURL(issueId)}/${successorId}`,
        newSuccessor,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  deleteSuccessor(issueId: string, successorId: string): Observable<any> {
    return this.httpClient
      .delete(`${this.getURL(issueId)}/${successorId}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }
}
