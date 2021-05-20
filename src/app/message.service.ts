import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from './interfaces/Message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  basicPath: string = '/messages';
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

  getMessages(): Observable<Message[]> {
    return this.httpClient
      .get<Message[]>(this.base.getUrl + this.basicPath, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getMessagesFromUser(userId: string): Observable<Message[]> {
    return this.httpClient
      .get<Message[]>(
        this.base.getUrl + this.basicPath + '/' + userId,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createMessage(newMessage: Message): Observable<Message> {
    return this.httpClient
      .post<Message>(
        this.base.getUrl + this.basicPath,
        newMessage,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateMessage(id: string, newMessage: Message): Observable<Message> {
    return this.httpClient
      .put<Message>(
        this.base.getUrl + this.basicPath + '/' + id,
        newMessage,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
