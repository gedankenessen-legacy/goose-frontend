import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { catchError, delay } from 'rxjs/operators';
import { RegisterContent } from './RegisterContent';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private router: Router, private base: BaseService, private httpClient: HttpClient) {
    
  }

  register(registercontent: RegisterContent): Observable<any>{
    return this.httpClient
    .post<any>(this.base.getUrl +"/auth/signUp", registercontent ,this.httpOptions) //URL?
    .pipe(catchError(this.base.errorHandle));
  }
}
