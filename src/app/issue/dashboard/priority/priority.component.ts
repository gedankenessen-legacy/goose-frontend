import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.less'],
})
export class PriorityComponent implements OnInit {
  @Input() public priority: number;

  color: string = "green";
  constructor() { }

  ngOnInit(): void {
    if(this.priority<=3)
      this.color = "green";
    else if(this.priority<=7)
      this.color = "orange";
    else
      this.color = "red";
  }

}
