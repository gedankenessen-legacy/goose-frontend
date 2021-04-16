import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from '../base.service';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router, private baseService: BaseService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('token')));
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

    return this.http.post<any>(this.baseService.getUrl + '/auth/signIn', { username, password }, httpOptions)
      .pipe(map(user => {
        let userObject = {...user.user, token: user.token};
        localStorage.setItem('token', JSON.stringify(userObject));
        this.currentUserSubject.next(user);
        return user;
      }));
  }


  loginAfterRegister(id: string, username: string, firstname: string, lastname: string, token: string) {
    let user: User = {
      id: id,
      username: username,
      firstname: firstname,
      lastname: lastname,
      token: token
    }

    localStorage.setItem('token', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    return true;
  }

}
