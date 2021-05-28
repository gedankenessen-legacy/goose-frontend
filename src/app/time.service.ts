import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { IssueTimeSheet } from './interfaces/issue/IssueTimeSheet';
import { User } from './interfaces/User';
import { IssueTimeSheetsService } from './issue/issue-time-sheets.service';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  user: User;

  constructor(
    private issueTimeSheetsService: IssueTimeSheetsService,
    private authService: AuthService
  ) {
    this.user = this.authService.currentUserValue;
  }

  startTimer(issueId: string): Observable<IssueTimeSheet> {
    const timerRunning = this.isTimerRunning();

    // if (timerRunning) this.stopTimer(issueId, timerRunning);

    const newTimeSheet: IssueTimeSheet = { user: this.user, start: new Date() };

    console.log(newTimeSheet);

    // this.subscribe(
    return this.issueTimeSheetsService.createTimeSheet(issueId, newTimeSheet);
    //   (data) => {
    //     console.log('Timer gestartet');
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  }

  stopTimer(
    issueId: string,
    timeSheets: IssueTimeSheet[]
  ): Observable<IssueTimeSheet> {
    const updatedTimeSheet: IssueTimeSheet = {
      ...this.isTimerRunningTimeSheets(timeSheets),
      end: new Date(),
    };

    console.log(updatedTimeSheet);

    return this.issueTimeSheetsService.updateTimeSheet(
      issueId,
      updatedTimeSheet.id,
      updatedTimeSheet
    );
    // this.subscribe(
    //   this.issueTimeSheetsService.updateTimeSheet(
    //     issueId,
    //     updatedTimeSheet.id,
    //     updatedTimeSheet
    //   ),
    //   (data) => {
    //     console.log('Timer gestoppt');
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  }

  /**
   *
   * @returns false, if no timer ist Running or the issueId of the running timer
   */
  isTimerRunning(): IssueTimeSheet {
    return null;
  }

  isTimerRunningTimeSheets(timeSheets: IssueTimeSheet[]): IssueTimeSheet {
    // this.subscribe(
    //   this.issueTimeSheetsService.getTimeSheets(issueId),
    //   (data) => {
    //     console.log(new Date(data[0].end).getMilliseconds());
    //     return true;
    //   },
    //   (error) => {
    //     console.error(error);
    //     return false;
    //   }
    // );

    // timeSheets.forEach((timeSheet) => {
    //   console.log(new Date(timeSheet.end).getMilliseconds() === 0);

    //   if (new Date(timeSheet.end).getMilliseconds() === 0) return true;
    // });

    for (let i = 0; i < timeSheets?.length; i++)
      if (new Date(timeSheets[i].end).getMilliseconds() === 0)
        return timeSheets[i];
    return null;
  }
}
