import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { ProjectUser } from '../interfaces/project/ProjectUser';

@Injectable({
  providedIn: 'root',
})
export class ProjectUserService {
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

  getProjectUsers(projectId: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.base.getUrl}/project/${projectId}/users`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  getProjectUser(projectId: number, id: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.base.getUrl}/project/${projectId}/users/${id}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createProject(
    projectId: number,
    newProjectUser: ProjectUser
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.base.getUrl}/project/${projectId}/users`,
        newProjectUser,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateProject(
    projectId: number,
    id: number,
    newProjectUser: ProjectUser
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.base.getUrl}/project/${projectId}/users/${id}`,
        newProjectUser,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
