import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { IssuePredecessor } from '../interfaces/issue/IssuePredecessor';
import { Issue } from '../interfaces/issue/Issue';

@Injectable({
  providedIn: 'root',
})
export class IssuePredecessorService {
  basicPath: string = '/predecessors';
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

  private getURL(issueId: string): string {
    return `${this.base.getUrl}/issues/${issueId}${this.basicPath}`;
  }

  getPredecessors(issueId: string): Observable<Issue[]> {
    return this.httpClient
      .get<Issue[]>(this.getURL(issueId), this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getPredecessor(
    issueId: string,
    predecessorId: string
  ): Observable<IssuePredecessor> {
    return this.httpClient
      .get<IssuePredecessor>(
        `${this.getURL(issueId)}/${predecessorId}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createPredecessor(
    issueId: string,
    newPredecessorId: string
  ): Observable<IssuePredecessor> {
    return this.httpClient
      .put<IssuePredecessor>(
        `${this.getURL(issueId)}/${newPredecessorId}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  deletePredecessor(issueId: string, predecessorId: string): Observable<any> {
    return this.httpClient
      .delete(`${this.getURL(issueId)}/${predecessorId}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }
}
