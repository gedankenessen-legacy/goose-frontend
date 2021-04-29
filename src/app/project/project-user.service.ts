import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError } from 'rxjs/operators';
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

  getProjectUsers(projectId: string): Observable<ProjectUser[]> {
    return this.httpClient
      .get<ProjectUser[]>(
        `${this.base.getUrl}/projects/${projectId}/users`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  getProjectUser(projectId: string, id: string): Observable<ProjectUser> {
    return this.httpClient
      .get<ProjectUser>(
        `${this.base.getUrl}/projects/${projectId}/users/${id}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateProjectUser(
    projectId: string,
    userId: string,
    newProjectUser: ProjectUser
  ): Observable<ProjectUser> {
    return this.httpClient
      .put<ProjectUser>(
        `${this.base.getUrl}/projects/${projectId}/users/${userId}`,
        newProjectUser,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  deleteProjectUser(projectId: string, id: string): Observable<any> {
    return this.httpClient
      .delete(
        `${this.base.getUrl}/projects/${projectId}/users/${id}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
