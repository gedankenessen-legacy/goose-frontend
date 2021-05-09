import { Component, Input, OnInit } from '@angular/core';
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

  loading: boolean = false;
  listOfIssues: Issue[];

  constructor(
    private issueService: IssueService,
    private modal: NzModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getIssues();
  }

  getIssues() {
    this.loading = true;
    this.subscribe(
      forkJoin([this.issueService.getIssues(this.projectId)]),
      (dataList) => {
        this.listOfIssues = dataList[0];
        console.log(this.listOfIssues);

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
}
