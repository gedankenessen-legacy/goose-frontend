import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { IssueTimeSheet } from '../interfaces/issue/IssueTimeSheet';

@Injectable({
  providedIn: 'root',
})
export class IssueTimeSheetsService {
  basicPath: string = '/timeSheets';
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

  getTimeSheets(issueId: string): Observable<IssueTimeSheet[]> {
    return this.httpClient
      .get<IssueTimeSheet[]>(this.getURL(issueId), this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getTimeSheet(
    issueId: string,
    timeSheetId: string
  ): Observable<IssueTimeSheet> {
    return this.httpClient
      .get<IssueTimeSheet>(
        `${this.getURL(issueId)}/${timeSheetId}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createTimeSheet(
    issueId: string,
    newTimeSheet: IssueTimeSheet
  ): Observable<IssueTimeSheet> {
    return this.httpClient
      .post<IssueTimeSheet>(
        this.getURL(issueId),
        newTimeSheet,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updatePredecessor(
    issueId: string,
    timeSheetId: string,
    newTimeSheet: IssueTimeSheet
  ): Observable<IssueTimeSheet> {
    return this.httpClient
      .put<IssueTimeSheet>(
        `${this.getURL(issueId)}/${timeSheetId}`,
        newTimeSheet,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  deletePredecessor(issueId: string, timeSheetId: string): Observable<any> {
    return this.httpClient
      .delete(`${this.getURL(issueId)}/${timeSheetId}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }
}
