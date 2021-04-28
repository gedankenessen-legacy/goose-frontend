import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { Company } from '../interfaces/company/Company';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  basicPath: string = '/companies';
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

  getCompanies(): Observable<Company[]> {
    return this.httpClient
      .get<Company[]>(this.base.getUrl + this.basicPath, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getCompany(id: string): Observable<Company> {
    return this.httpClient
      .get<Company>(
        this.base.getUrl + this.basicPath + '/' + id,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  createCompany(newCompany: Company): Observable<Company> {
    return this.httpClient
      .post<Company>(
        this.base.getUrl + this.basicPath,
        newCompany,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateCompany(id: string, newCompany: Company): Observable<Company> {
    return this.httpClient
      .put<Company>(
        this.base.getUrl + this.basicPath + '/' + id,
        newCompany,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  getCompanyUser(id: string): Observable<User> {
    return this.httpClient
      .get<User>(
        `${this.base.getUrl}${this.basicPath}/${id}/user`,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
