import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.less']
})
export class ProgressBarComponent implements OnInit {
  @Input() public currentProgress: number;
  @Input() public expectedProgress: number;

  color: string = "green";
  
  constructor() { }

  ngOnInit(): void {
    const diffProgress: number = this.expectedProgress - this.currentProgress;
    
    if(diffProgress <=0)
      this.color = "green";
    else if(diffProgress <= 25)
      this.color = "orange";
    else if (diffProgress > 25)
      this.color = "red";
    else
      this.color = "gray";
  }

}
