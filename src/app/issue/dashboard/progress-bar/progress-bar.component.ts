import { Component, Input, OnInit } from '@angular/core';
import { IssueTimeSheet } from 'src/app/interfaces/issue/IssueTimeSheet';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.less'],
})
export class ProgressBarComponent implements OnInit {
  @Input() public progress: number;
  @Input() public expectedTime: number;
  @Input() public totalWorkTime: number;

  color: string = 'green';

  constructor() {}

  ngOnInit(): void {
    const expectedProgress =
      (this.totalWorkTime / (this.expectedTime * 3600)) * 100;

    const diffProgress: number = expectedProgress - this.progress;

    if (diffProgress <= 0) this.color = 'green';
    else if (diffProgress <= 25) this.color = 'orange';
    else if (diffProgress > 25) this.color = 'red';
    else this.color = 'gray';
  }
}
