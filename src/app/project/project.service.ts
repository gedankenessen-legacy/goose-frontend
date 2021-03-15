import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import Project from '../interfaces/project/Project';

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
    // this.getProjects = this.getProjectsDemo;
  }

  getProjects(): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + "/project", this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getIssues(): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + "/issues", this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  // Demo / dummy data
  projectDemo: Array<Project> = [
    {
      id: 0,
      name: 'Goose',
      company_id: 0,
      users: [
        {
          id: 2,
          user: {
            id: 2,
            firstname: "Hans",
            lastname: "Hansen"
          },
          roles: [
            {
              id: 2,
              name: "customer"
            }
          ]
        }
      ],
      states: [
        {
          id: 5,
          name: "test",
          phase: "test",
          userGenerated: false
        }
      ]
    // }
    // {
    //   name: 'Blob',
    //   user: {
    //     forename: 'Fred',
    //     lastname: 'Frederick'
    //   },
    // },
    // {
    //   name: 'MegaNiceWebsite',
    //   user: {
    //     forename: 'Martin',
    //     lastname: 'Martinez'
    //   },
    }
  ]

  // Get projects from dummy
  getProjectsDemo(): Observable<Array<Project>> {
    return of(this.projectDemo).pipe(delay(500));
  }
}
