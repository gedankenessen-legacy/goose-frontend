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

    const newTimeSheet: IssueTimeSheet = { user: this.user, start: new Date() };

    return this.issueTimeSheetsService.createTimeSheet(issueId, newTimeSheet);
  }

  stopTimer(
    issueId: string,
    timeSheets: IssueTimeSheet[]
  ): Observable<IssueTimeSheet> {
    const updatedTimeSheet: IssueTimeSheet = {
      ...this.isTimerRunningTimeSheets(timeSheets),
      end: new Date(),
    };

    return this.issueTimeSheetsService.updateTimeSheet(
      issueId,
      updatedTimeSheet.id,
      updatedTimeSheet
    );
  }

  /**
   *
   * @returns false, if no timer ist Running or the issueId of the running timer
   */
  isTimerRunning(): IssueTimeSheet {
    return null;
  }

  isTimerRunningTimeSheets(timeSheets: IssueTimeSheet[]): IssueTimeSheet {
    for (let i = 0; i < timeSheets?.length; i++)
      if (
        new Date(timeSheets[i].end).getMilliseconds() === 0 &&
        timeSheets[i].user.username == this.user.username
      )
        return timeSheets[i];
    return null;
  }
}
