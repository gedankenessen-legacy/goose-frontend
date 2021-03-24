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
  ) {}

  getStates(projectId: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.base.getUrl}/project/${projectId}/state`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  getState(projectId: number, id: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.base.getUrl}/project/${projectId}/state/${id}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createState(projectId: number, newState: State): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.base.getUrl}/project/${projectId}/state`,
        newState,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateState(projectId: number, id: number, newState: State): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.base.getUrl}/project/${projectId}/state/${id}`,
        newState,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  // deleteState(projectId:number, id: number):Observable<any>{
  //   return this.httpClient
  //     .delete(this.base.getUrl + '/product/'+id, this.httpOptions)
  //     .pipe(catchError(this.base.errorHandle));
  // }
}
