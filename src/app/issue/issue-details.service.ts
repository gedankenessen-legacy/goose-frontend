import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../base.service';
import { IssueDetail } from '../interfaces/issue/IssueDetail';

@Injectable({
  providedIn: 'root',
})
export class IssueDetailsService {
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
   * Erhalte Issue Details eines Projektes anhand von Id
   * @param projectId Id des Projektes in dem sich Issue befindet
   * @param issueId Id des Issues
   * @param parameters Optionen welche zusätzliche Inhalte beinhaltet werden (z.B. `{getParent:true}` um auch Parent zu erhalten)
   * @return `Observable` von `Issues`
   */
  getIssue(
    projectId: string,
    issueId: string,
    parameters?: {}
  ): Observable<any> {
    return this.httpClient
      .get<any>(`${this.getURL(projectId)}/${issueId}`, {
        ...this.httpOptions,
        params: parameters,
      })
      .pipe(catchError(this.base.errorHandle));
  }
}
