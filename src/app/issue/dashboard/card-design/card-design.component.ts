import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { IssueService } from '../../issue.service';

@Component({
  selector: 'app-card-design',
  templateUrl: './card-design.component.html',
  styleUrls: ['./card-design.component.less'],
})
export class CardDesignComponent extends SubscriptionWrapper implements OnInit {
  @Input() public projectId: string;
  @Input() public companyId: string;
  @Input() public searchValue: string;

  loading: boolean = false;
  issuesPerPage: number = 6;
  currentPage: number = 1;

  listOfIssues: Issue[];
  listOfDisplayIssues: Issue[];

  constructor(
    private issueService: IssueService,
    private modal: NzModalService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getIssues();
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    this.search();
  }

  routeToIssue(issueId: string): void {
    this.router
      .navigateByUrl(
        `${this.companyId}/projects/${this.projectId}/issues/${issueId}`
      )
      .then();
  }

  getIssues(): void {
    this.loading = true;
    this.subscribe(
      forkJoin([
        this.issueService.getIssues(this.projectId, { getTimeSheets: true }),
      ]),
      (dataList) => {
        this.listOfIssues = dataList[0];
        this.search();

        this.loading = false;
      },
      (error) => {
        this.modal.error({
          nzTitle: 'Fehler beim Laden der Tickets',
          nzContent: 'Error ' + error['Error Code'] + ': ' + error['Message'],
        });

        this.loading = false;
      }
    );
  }

  search(): void {
    this.listOfDisplayIssues = !this.searchValue
      ? this.listOfIssues
      : this.listOfIssues.filter((issue) =>
          new RegExp(`(.*?)${this.searchValue}(.*?)`, 'i').test(
            issue.issueDetail.name
          )
        );
  }
}
