import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'src/app/interfaces/issue/issue';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.less'],
})
export class IssueComponent implements OnInit {
  issueId: number;
  issue: Issue;
  loading: boolean = true;

  currenActivComponent: number = 0;

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.issueId = Number(params.get('id'));
      this.getIssue();
    });
  }

  changedSelectedMenu(selected: number) {
    if (selected !== this.currenActivComponent)
      this.currenActivComponent = selected;
  }

  getIssue() {
    this.loading = true;
    this.issueService.getIssue(this.issueId).subscribe(
      (data) => {
        this.issue = data;
        this.loading = false;
      },
      (error) => {
        // TODO Fehlerausgabe
        console.error(error);
        this.loading = false;
      }
    );
  }
}
