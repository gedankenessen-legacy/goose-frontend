import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { Company } from '../interfaces/company/Company';

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

  getCompanies(): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + this.basicPath, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  getCompany(id: number): Observable<any> {
    return this.httpClient
      .get<any>(this.base.getUrl + this.basicPath + '/' + id, this.httpOptions)
      .pipe(catchError(this.base.errorHandle));
  }

  createCompany(newCompany: Company): Observable<any> {
    return this.httpClient
      .post<any>(
        this.base.getUrl + this.basicPath,
        newCompany,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

  updateCompany(id: number, newCompany: Company): Observable<any> {
    return this.httpClient
      .put<any>(
        this.base.getUrl + this.basicPath + '/' + id,
        newCompany,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }
}
