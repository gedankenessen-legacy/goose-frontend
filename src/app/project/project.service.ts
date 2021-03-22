import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { Project } from '../interfaces/project/Project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
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

  getProjects(companyId: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.base.getUrl}/company/${companyId}/project`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  getProject(companyId: number, id: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.base.getUrl}/company/${companyId}/project/${id}`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createProject(companyId: number, newProject: Project): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.base.getUrl}/company/${companyId}/project`,
        newProject,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateProject(
    companyId: number,
    id: number,
    newProject: Project
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.base.getUrl}/company/${companyId}/project/${id}`,
        newProject,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
