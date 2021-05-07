import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IdentityService {

  public userId: ReplaySubject<string> = new ReplaySubject<string>();
  public companyId: ReplaySubject<string> = new ReplaySubject<string>();
  public projectId: ReplaySubject<string> = new ReplaySubject<string>();

  constructor() {
  }
}
