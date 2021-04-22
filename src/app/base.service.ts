import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  //private url: string = 'http://51.254.157.180:5000/api';
  private url: string = 'http://localhost:5000/api';

  constructor() {}

  /**
   * Return base url
   */
  public get getUrl(): string {
    return this.url;
  }

  /**
   * Error handler
   */
  public errorHandle(error) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = {
        'Error Code': error.status,
        Message: error.message,
        Error: error,
      };
    }
    return throwError(errorMessage);
  }
}
