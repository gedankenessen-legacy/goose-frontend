import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../base.service';
import { LoginContent } from './LoginContent';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
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

  login(logincontent: LoginContent) {
    return this.httpClient
      .post<any>(
        this.base.getUrl + '/auth/signIn',
        logincontent,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
