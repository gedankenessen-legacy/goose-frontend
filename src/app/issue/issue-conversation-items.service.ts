import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { IssueConversationItem } from '../interfaces/issue/IssueConversationItem';

@Injectable({
  providedIn: 'root',
})
export class IssueConversationItemsService {
  basicPath: string = '/conversations';
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

  getConversationItems(issueId: string): Observable<IssueConversationItem[]> {
    return this.httpClient
      .get<IssueConversationItem[]>(this.getURL(issueId), this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getConversationItem(
    issueId: string,
    conversationId: string
  ): Observable<IssueConversationItem> {
    return this.httpClient
      .get<IssueConversationItem>(
        `${this.getURL(issueId)}/${conversationId}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createConversationItem(
    issueId: string,
    newConversationItem: IssueConversationItem
  ): Observable<IssueConversationItem> {
    return this.httpClient
      .post<IssueConversationItem>(
        this.getURL(issueId),
        newConversationItem,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateConversationItem(
    issueId: string,
    conversationId: string,
    newConversationItem: IssueConversationItem
  ): Observable<IssueConversationItem> {
    return this.httpClient
      .put<IssueConversationItem>(
        `${this.getURL(issueId)}/${conversationId}`,
        newConversationItem,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
