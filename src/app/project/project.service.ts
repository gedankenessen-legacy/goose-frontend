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
  basicPath: string = '/projects';
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

  private getURL(companyId: string): string {
    return `${this.base.getUrl}/companies/${companyId}${this.basicPath}`;
  }

  getProjects(companyId: string): Observable<Project[]> {
    return this.httpClient
      .get<Project[]>(`${this.getURL(companyId)}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getProject(companyId: string, id: string): Observable<Project> {
    return this.httpClient
      .get<Project>(`${this.getURL(companyId)}/${id}`, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  createProject(companyId: string, newProject: Project): Observable<Project> {
    return this.httpClient
      .post<Project>(`${this.getURL(companyId)}`, newProject, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  updateProject(
    companyId: string,
    id: string,
    newProject: Project
  ): Observable<Project> {
    return (
      this.httpClient
        // TODO: Gibt PUT Ressource zurück ?
        .put<Project>(
          `${this.getURL(companyId)}/${id}`,
          newProject,
          this.httpOptions
        )
        .pipe(catchError(this.base.errorHandle))
    );
  }
}
