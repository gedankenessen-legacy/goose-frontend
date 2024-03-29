import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BaseService } from '../base.service';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private baseService: BaseService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('token'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<any>(
        this.baseService.getUrl + '/auth/signIn',
        { username, password },
        httpOptions
      )
      .pipe(
        tap((data) => {
          localStorage.setItem(
            'token',
            JSON.stringify({ ...data.user, token: data.token })
          );
          localStorage.setItem('companies', JSON.stringify(data.companies));
          this.currentUserSubject.next({ ...data.user, token: data.token });
        })
      );
  }

  loginAfterRegister(
    id: string,
    username: string,
    firstname: string,
    lastname: string,
    token: string,
    companyId: string,
    companyName: string
  ) {
    let user: User = {
      id: id,
      username: username,
      firstname: firstname,
      lastname: lastname,
      token: token,
    };

    let companies: any[] = [
      {
        id: companyId,
        name: companyName,
      },
    ];

    localStorage.setItem('companies', JSON.stringify(companies));
    localStorage.setItem('token', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
    localStorage.removeItem('companies');
    this.currentUserSubject.next(null);
    return true;
  }
}
