import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  basicPath: string = '/users';
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

  getUsers(): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + this.basicPath, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getUser(id: number): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + this.basicPath + '/' + id, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }
}