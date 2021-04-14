import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { BaseService } from "../base.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { CompanyUser } from "../interfaces/company/CompanyUser";
import { RegisterContentCustomer } from "../interfaces/register/RegisterContentCustomer";

@Injectable({
  providedIn: 'root'
})
export class CompanyUserService {
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
  ) { }

  getCompanyUsers(companyId: string): Observable<CompanyUser[]> {
    return this.httpClient
      .get<CompanyUser[]>(this.base.getUrl + this.basicPath + '/' + companyId + '/users', this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getCompanyUser(companyId: string, id: string): Observable<CompanyUser> {
    return this.httpClient
      .get<CompanyUser>(this.base.getUrl + this.basicPath + '/' + companyId + '/users/' + id, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  createCompanyUser(companyId: string, newCompanyUser: RegisterContentCustomer): Observable<CompanyUser> {
    return this.httpClient
      .post<CompanyUser>(this.base.getUrl + this.basicPath + '/' + companyId + '/users', newCompanyUser, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  updateCompanyUser(companyId: string, id: string, newCompanyUser: RegisterContentCustomer): Observable<CompanyUser> {
    return this.httpClient
      .put<CompanyUser>(this.base.getUrl + this.basicPath + '/' + companyId + '/users/' + id, newCompanyUser, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }
}
