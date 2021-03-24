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

  getIssues(): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + this.basicPath, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getIssue(id: number): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + this.basicPath + '/' + id, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  createIssue(newIssue: Issue): Observable<any> {
    return this.httpClient
      .post<any>(this.base.getUrl + this.basicPath, newIssue, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  updateIssue(id: number, newIssue: Issue): Observable<any> {
    return this.httpClient
      .put<any>(
        this.base.getUrl + this.basicPath + '/' + id,
        newIssue,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
