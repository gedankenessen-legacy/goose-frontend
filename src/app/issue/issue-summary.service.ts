import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../base.service';
import { Issue } from '../interfaces/issue/Issue';
import { IssueRequirement } from '../interfaces/issue/IssueRequirement';

@Injectable({
  providedIn: 'root'
})
export class IssueSummaryService {
  basicPath: string = '/summaries';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private base: BaseService,
    private httpClient: HttpClient
  ) { }
  private getURL(issueId: string): string {
    return `${this.base.getUrl}/issues/${issueId}${this.basicPath}`;
  }

  updateSummary(
    issueId: string,
    accept: boolean
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.getURL(issueId)}`,
        {},
        { ...this.httpOptions, 
          params: new HttpParams().set('accept', `${accept}`)
        }
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createSummary(
    issueId: string,
    listOfRequirements: IssueRequirement[]
    ): Observable<any> {
      return this.httpClient
      .post<any>(
        `${this.base.getUrl}/issues/${issueId}/summaries`,
        listOfRequirements,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
    }
}
