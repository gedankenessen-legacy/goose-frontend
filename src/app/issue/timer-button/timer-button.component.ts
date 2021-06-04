import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueTimeSheet } from 'src/app/interfaces/issue/IssueTimeSheet';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { User } from 'src/app/interfaces/User';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { TimeService } from 'src/app/time.service';

@Component({
  selector: 'app-timer-button',
  templateUrl: './timer-button.component.html',
  styleUrls: ['./timer-button.component.less'],
})
export class TimerButtonComponent
  extends SubscriptionWrapper
  implements OnInit
{
  @Input() public issueId: string;
  @Input() public issueTimeSheets: IssueTimeSheet[];
  @Input() public phase: string;
  @Input() public projectId: string;

  timerRunning: boolean = false;

  constructor(
    private timeService: TimeService,
    private authService: AuthService,
    private projectUserService: ProjectUserService
  ) {
    super();
  }

  listOfProjectUsers: ProjectUser[] = [];

  ngOnInit(): void {
    this.subscribe(
      this.projectUserService.getProjectUsers(this.projectId),
      (data) => {
        this.listOfProjectUsers = data;
      }
    );
    this.timerRunning = this.timeService.isTimerRunningTimeSheets(
      this.issueTimeSheets
    )
      ? true
      : false;
  }

  handleButtonClicked(event): void {
    event.stopPropagation();
    if (this.timerRunning) {
      this.subscribe(
        this.timeService.stopTimer(this.issueId, this.issueTimeSheets),
        (data) => {
          this.timerRunning = false;
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.subscribe(
        this.timeService.startTimer(this.issueId),
        (data) => {
          this.issueTimeSheets = [...this.issueTimeSheets, data];

          this.timerRunning = true;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  public cannotStartTime(): Boolean {
    let loggedInUser = this.authService.currentUserValue;
    let user = this.listOfProjectUsers.filter(
      (user) => user.user.id === loggedInUser.id
    )[0];
    return (
      user?.roles.some(
        (r) =>
          r.name === 'Mitarbeiter (Lesend)' ||
          r.name === 'Kunde' ||
          r.name === 'Firma'
      ) || this.phase === 'Abschluss'
    );
  }
}
