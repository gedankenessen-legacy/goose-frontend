import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { IssueParent } from '../interfaces/issue/IssueParent';

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

  getParent(issueId: string): Observable<IssueParent[]> {
    return this.httpClient
      .get<IssueParent[]>(this.getURL(issueId), this.httpOptions)
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
}
