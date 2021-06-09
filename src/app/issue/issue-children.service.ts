import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../base.service';
import { Issue } from '../interfaces/issue/Issue';
import { IssueChildren } from '../interfaces/issue/IssueChildren';

@Injectable({
  providedIn: 'root',
})
export class IssueChildrenService {
  basicPath: string = '/children';
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

  getChildren(
    issueId: string,
    recursive: boolean
  ): Observable<IssueChildren[]> {
    return this.httpClient
      .get<IssueChildren[]>(this.getURL(issueId), {
        ...this.httpOptions,
        params: new HttpParams().set('recursive', `${recursive}`),
      })
      .pipe(catchError(this.base.errorHandle));
  }
}
