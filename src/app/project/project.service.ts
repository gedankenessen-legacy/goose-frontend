import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import project from "./interfaces/Project";
import user from "./interfaces/User";
import { BaseService } from "../base.service";
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private router: Router, private base: BaseService, private httpClient: HttpClient) {
    this.getProject = this.getProjectDemo;
  }

  getProject(): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + "/project", this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  // Demo / dummy data
  projectDemo: Array<project> = [
    {
      id: 0,
      name: 'Goose',
      user: {
        forename: 'Hans',
        lastname: 'Hansen'
      },
      issues: 15,
      issuesOpen: 10
    },
    {
      id: 1,
      name: 'Blob',
      user: {
        forename: 'Fred',
        lastname: 'Frederick'
      },
      issues: 16,
      issuesOpen: 2
    },
    {
      id: 2,
      name: 'MegaNiceWebsite',
      user: {
        forename: 'Martin',
        lastname: 'Martinez'
      },
      issues: 1,
      issuesOpen: 0
    }
  ]

  // Get projects from dummy
  getProjectDemo(): Observable<Array<project>> {
    return of(this.projectDemo).pipe(delay(500));
  }
}
