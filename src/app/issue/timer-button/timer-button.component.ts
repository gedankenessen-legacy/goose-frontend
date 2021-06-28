import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IssueTimeSheet } from 'src/app/interfaces/issue/IssueTimeSheet';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { TimeService } from 'src/app/time.service';
import { IssueAssignedUsersService } from '../issue-assigned-users.service';

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
  @Output() buttonPressed = new EventEmitter();

  timerRunning: boolean = false;

  constructor(
    private timeService: TimeService,
    private authService: AuthService,
    private projectUserService: ProjectUserService,
    private issueAssignedUsersService: IssueAssignedUsersService
  ) {
    super();
  }

  listOfProjectUsers: ProjectUser[] = [];
  listOfAssigneUsers: ProjectUser[] = [];

  ngOnInit(): void {
    this.subscribe(
      forkJoin(
        this.projectUserService.getProjectUsers(this.projectId),
        this.issueAssignedUsersService.getAssignedUsers(this.issueId)
      ),

      (data) => {
        this.listOfProjectUsers = data[0];
        this.listOfAssigneUsers = data[1];
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

          this.buttonPressed.emit(null);
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

          this.buttonPressed.emit(null);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  cannotStartTime(): Boolean {
    let user = this.listOfProjectUsers.filter(
      (user) => user.user.id === this.authService.currentUserValue.id
    )[0];

    let hasNotRights: Boolean = false;

    if (user?.roles?.some((r) => r.name == 'Mitarbeiter')) {
      hasNotRights = !this.listOfAssigneUsers.some((u) => u.id == user.user.id);
    } else {
      hasNotRights = user?.roles.some(
        (r) => r.name === 'Mitarbeiter (Lesend)' || r.name === 'Kunde'
      );
    }

    return hasNotRights || this.phase === 'Abschlussphase';
    // return hasNotRights || this.phase === 'Abschluss' || this.phase === 'Überprüfung';
  }
}
