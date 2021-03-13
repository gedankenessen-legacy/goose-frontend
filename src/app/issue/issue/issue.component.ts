import { Component, OnInit } from '@angular/core';
import { issue } from 'src/app/interfaces/issue/issue';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.less'],
})
export class IssueComponent implements OnInit {
  issue: issue = {
    name: 'Test',
    type: 'Feature',
    startDate: '01.01.2021',
    endDate: '01.01.2022',
    expectedTime: 40,
    progress: 20,
    description: `
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
  sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus 
  est Lorem ipsum dolor sit amet.
  `,
    requirements: [
      {
        id: '0',
        requirement: 'Requirement 1',
      },
    ],
    requirementsAccepted: true,
    requirementsNested: false,
    priority: 1,
    visibility: true,
  };

  currenActivComponent: number = 0;

  constructor() {}

  ngOnInit(): void {}

  changedSelectedMenu(selected: number) {
    if (selected !== this.currenActivComponent)
      this.currenActivComponent = selected;
  }
}
