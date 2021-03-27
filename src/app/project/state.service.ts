import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { State } from '../interfaces/project/State';

@Injectable({
  providedIn: 'root',
})
export class StateService {
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

  getStates(projectId: string): Observable<State[]> {
    return this.httpClient
      .get<State[]>(
        `${this.base.getUrl}/projects/${projectId}/state`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  getState(projectId: string, id: string): Observable<State> {
    return this.httpClient
      .get<State>(
        `${this.base.getUrl}/projects/${projectId}/state/${id}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createState(projectId: string, newState: State): Observable<State> {
    return this.httpClient
      .post<State>(
        `${this.base.getUrl}/projects/${projectId}/state`,
        newState,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateState(projectId: string, id: string, newState: State): Observable<State> {
    return this.httpClient
      .put<State>(
        `${this.base.getUrl}/projects/${projectId}/state/${id}`,
        newState,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  deleteState(projectId: string, id: string): Observable<any> {
    return this.httpClient
      .delete(`${this.base.getUrl}/projects/${projectId}/state/${id}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }
}
