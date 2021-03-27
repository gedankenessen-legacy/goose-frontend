import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { catchError, delay } from 'rxjs/operators';
import { User } from './interfaces/User';

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
  ) { }

  getUsers(): Observable<User> {
    return this.httpClient
      .get<User>(this.base.getUrl + this.basicPath, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getUser(id: string): Observable<User> {
    return this.httpClient
      .get<User>(this.base.getUrl + this.basicPath + '/' + id, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }


  createUser(newUser: User): Observable<User> {
    return this.httpClient
      .post<User>(this.base.getUrl + this.basicPath, newUser, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  updateUser(id: string, newUser: User): Observable<User> {
    return this.httpClient
      .put<User>(this.base.getUrl + this.basicPath + '/' + id, newUser, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }
}
