import { Component, Input, OnInit } from '@angular/core';
import { IssueTimeSheet } from '../../interfaces/issue/IssueTimeSheet';
import { SubscriptionWrapper } from '../../SubscriptionWrapper';
import { IssueTimeSheetsService } from '../issue-time-sheets.service';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProjectUser } from '../../interfaces/project/ProjectUser';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.less'],
})
export class TimesheetComponent extends SubscriptionWrapper implements OnInit {
  @Input() public issueId: string;
  @Input() public currentUser: ProjectUser;

  constructor(
    private timeSheetService: IssueTimeSheetsService,
    private modal: NzModalService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(this.getTimeSheets(), () =>
      console.log(this.listOfTimeSheets)
    );
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
    let diffInMinutes: number = Math.ceil(diffInMilliseconds / 1000 / 60);

    let hours: number = Math.floor(diffInMinutes / 60);
    let minutes: number = diffInMinutes % 60;

    return { hours: hours, minutes: minutes };
  }

  // Functions for editing the TimeSheet
  startEdit(timeSheet: IssueTimeSheet): void {
    if (!this.canEdit(timeSheet.user.id)) {
      this.modal.error({
        nzTitle: 'Unauthorized',
        nzContent: 'Sie sind nicht berechtigt die gebuchte Zeit zu ändern',
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
    console.log(this.authService.currentUserValue.id === userId);
    console.log(this.hasRole('Projektleiter'));
    console.log(this.hasRole('Firma'));

    return (
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
        // Demo Data
        timeSheets = [
          ...this.listOfTimeSheets,
          {
            user: {
              id: '609421f4d837b069802b738d',
              username: 'MSchlosshauer',
              firstname: 'Marlon',
              lastname: 'Schlosshauer',
            },
            start: new Date(),
            end: new Date(2021, 4, 10, 1, 31),
          },
          {
            user: {
              id: '60987366682670f75ebe0c33',
              username: 'CWetzel',
              firstname: 'Claudio',
              lastname: 'Wetzel',
            },
            start: new Date(),
            end: new Date(2021, 4, 10, 1, 31),
          },
        ];

        // Save Data and add Diff Value of End-start + edit boolean
        this.listOfTimeSheets = timeSheets.map((timeSheet) => {
          return {
            id: timeSheet.id,
            user: timeSheet.user,
            start: timeSheet.start,
            end: timeSheet.end,
            diff: this.getDifference(
              timeSheet.end.valueOf() - timeSheet.start.valueOf()
            ),
          };
        });
      })
    );
  }
}
