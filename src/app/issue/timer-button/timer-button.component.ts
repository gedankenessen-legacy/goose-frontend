import { Component, Input, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueTimeSheet } from 'src/app/interfaces/issue/IssueTimeSheet';
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
  @Input() public disabled: Boolean;

  timerRunning: boolean = false;

  constructor(private timeService: TimeService) {
    super();
  }

  ngOnInit(): void {
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
          console.log('timer gestoppt');
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
          console.log('timer gestartet');

          this.issueTimeSheets = [...this.issueTimeSheets, data];

          this.timerRunning = true;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
