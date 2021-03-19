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
  basicPath: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private router: Router,
    private base: BaseService,
    private httpClient: HttpClient,
    private companyId: number
  ) {
    this.basicPath = `/company/${companyId}/project`;
  }

  getProjects(): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + this.basicPath, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getProject(id: number): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + this.basicPath + '/' + id, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  createProject(newProject: Project): Observable<any> {
    return this.httpClient
      .post<any>(
        this.base.getUrl + this.basicPath,
        newProject,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateProject(id: number, newProject: Project): Observable<any> {
    return this.httpClient
      .put<any>(
        this.base.getUrl + this.basicPath + '/' + id,
        newProject,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
