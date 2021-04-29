import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Role } from './interfaces/Role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  basicPath: string = '/roles';
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

  getRoles(): Observable<Role[]> {
    return this.httpClient
      .get<Role[]>(this.base.getUrl + this.basicPath, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getRole(id: string): Observable<Role> {
    return this.httpClient
      .get<Role>(this.base.getUrl + this.basicPath + '/' + id, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  createRole(newRole: Role): Observable<Role> {
    return this.httpClient
      .post<Role>(this.base.getUrl + this.basicPath, newRole, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  updateUser(id: string, newRole: Role): Observable<Role> {
    return this.httpClient
      .put<Role>(
        this.base.getUrl + this.basicPath + '/' + id,
        newRole,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
