import { Component, Input, OnInit } from '@angular/core';
import { IssueTimeSheet } from '../../interfaces/issue/IssueTimeSheet';
import { SubscriptionWrapper } from '../../SubscriptionWrapper';
import { IssueTimeSheetsService } from '../issue-time-sheets.service';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProjectUser } from '../../interfaces/project/ProjectUser';
import { State } from '../../interfaces/project/State';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.less'],
})
export class TimesheetComponent extends SubscriptionWrapper implements OnInit {
  @Input() public issueId: string;
  @Input() public issueState: State;
  @Input() public currentUser: ProjectUser;

  constructor(
    private timeSheetService: IssueTimeSheetsService,
    private modal: NzModalService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(this.getTimeSheets());
  }

  listOfTimeSheets: IssueTimeSheet[] = [];

  hasRole(role: string): boolean {
    return this.currentUser?.roles.some((r) => r.name === role);
  }

  /*
   * Helper Function for calculating the Difference of the TimeSheet end - start date
   */
  getDifference(
    diffInMilliseconds: number
  ): { hours: number; minutes: number } {
    let diffInMinutes: number = Math.floor(diffInMilliseconds / 1000 / 60);

    let hours: number = Math.floor(diffInMinutes / 60);
    let minutes: number = Math.floor(diffInMinutes % 60);

    return { hours: hours, minutes: minutes };
  }

  // Functions for editing the TimeSheet
  startEdit(timeSheet: IssueTimeSheet): void {
    if (!this.canEdit(timeSheet.user.id)) {
      this.modal.error({
        nzTitle: 'Unauthorized',
        nzContent:
          'Sie sind nicht berechtigt die gebuchte Zeit zu ändern oder die Abschlussphase wurde erreicht',
      });
      return;
    }

    timeSheet['tempStart'] = timeSheet.start;
    timeSheet['tempEnd'] = timeSheet.end;
    timeSheet['edit'] = true;
  }

  stopEdit(timeSheet: IssueTimeSheet): void {
    if (timeSheet['tempStart'].getTime() > timeSheet['tempEnd'].getTime()) {
      this.modal.error({
        nzTitle: 'Error beim ändern der gebuchten Zeit',
        nzContent: 'Das Startdatum darf nicht hinter dem Enddatum liegen',
      });
      return;
    }

    timeSheet.start = timeSheet['tempStart'];
    timeSheet.end = timeSheet['tempEnd'];
    timeSheet['edit'] = false;

    this.subscribe(
      this.timeSheetService.updatePredecessor(
        this.issueId,
        timeSheet.id,
        timeSheet
      )
    );
  }

  onChange(timeSheet: IssueTimeSheet): void {
    timeSheet['diff'] = this.getDifference(
      timeSheet['tempEnd'].valueOf() - timeSheet['tempStart'].valueOf()
    );
  }

  /*
   * Helper function to determinate if the User can edit the TimeSheet
   */
  canEdit(userId: string): boolean {
    return (
      this.issueState.phase !== 'Abschlussphase' &&
      !this.hasRole('Mitarbeiter (Lesend)') &&
      (this.authService.currentUserValue.id === userId ||
        this.hasRole('Projektleiter') ||
        this.hasRole('Firma'))
    );
  }

  // Getters
  getTimeSheets(): Observable<IssueTimeSheet[]> {
    return this.timeSheetService.getTimeSheets(this.issueId).pipe(
      tap((timeSheets) => {
        // Save Data and add Diff Value of End-start date
        this.listOfTimeSheets = timeSheets.map((timeSheet) => {
          let start = new Date(timeSheet.start);
          let end = new Date(timeSheet.end);

          return {
            id: timeSheet.id,
            user: timeSheet.user,
            start: start,
            end: end,
            diff: this.getDifference(end.valueOf() - start.valueOf()),
          };
        });
      })
    );
  }
}
