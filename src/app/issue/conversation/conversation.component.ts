import { Component, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';
import { User } from 'src/app/interfaces/User';
import { IssueConversationItemsService } from '../issue-conversation-items.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { Observable, Subject, forkJoin } from 'rxjs';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { IssueService } from '../issue.service';
import { IssueSummaryService } from '../issue-summary.service';
import { switchMap, tap } from 'rxjs/operators';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import {
  CompanyRole,
  CustomerRole,
  ProjectLeaderRole,
  ReadonlyEmployeeRole,
} from 'src/app/interfaces/Role';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less'],
})
export class ConversationComponent
  extends SubscriptionWrapper
  implements OnInit
{
  @Input() public issueId: string;
  @Input() public projectId: string;
  @Output()
  public selectedConversation: Subject<string> = new Subject<string>();
  public issue: Issue;
  public user: User;
  public summaryActive: Boolean;
  public projectUser: ProjectUser;
  listOfConversations: IssueConversationItem[] = [];
  inputOfConversation = '';
  dateString: String;

  constructor(
    private issueConversationService: IssueConversationItemsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private issueService: IssueService,
    private summaryService: IssueSummaryService,
    private projectUserService: ProjectUserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(this.auth.currentUser, (user) => (this.user = user));
    this.subscribe(
      forkJoin([
        this.issueService.getIssue(this.projectId, this.issueId),
        this.projectUserService.getProjectUser(this.projectId, this.user.id),
        this.fetchConversationItems(),
      ]),
      (dataList) => {
        this.issue = dataList[0];
        this.projectUser = dataList[1];
      }
    );
  }

  readRights(): boolean {
    return this.projectUser?.roles?.some(
      (r) => r.name === ReadonlyEmployeeRole
    );
  }

  isArchived(): boolean {
    return this.issue?.state?.name == 'Archiviert';
  }

  filterSummaries(items: IssueConversationItem[]): IssueConversationItem[] {
    items.reverse();
    let lastSum;
    for (lastSum = 0; lastSum < items.length; lastSum++) {
      if (
        items[lastSum]?.type == 'Zusammenfassung' ||
        items[lastSum]?.type == 'Zusammenfassung akzeptiert' ||
        items[lastSum]?.type == 'Zusammenfassung abgelehnt'
      ) {
        break;
      }
    }

    let newItems;
    if (
      items[lastSum]?.type == 'Zusammenfassung akzeptiert' ||
      items[lastSum]?.type == 'Zusammenfassung abgelehnt'
    ) {
      this.summaryActive = false;
      newItems = items.filter((item) => item.type != 'Zusammenfassung');
    } else if (items[lastSum]?.type == 'Zusammenfassung') {
      items[lastSum].createdAt = new Date(items[lastSum].createdAt);
      items[lastSum].createdAt = new Date(
        Date.UTC(
          items[lastSum].createdAt.getFullYear(),
          items[lastSum].createdAt.getMonth(),
          items[lastSum].createdAt.getDay(),
          items[lastSum].createdAt.getHours(),
          items[lastSum].createdAt.getMinutes(),
          0
        )
      );
      this.dateString = items[lastSum].createdAt.toLocaleString('de-DE', {
        timeZone: 'UTC',
      });
      this.summaryActive = true;
      for (let index = lastSum + 1; index < items.length; index++) {
        if (items[index]?.type == 'Zusammenfassung') {
          items.splice(index, 1);
        }
      }
      newItems = items;
    } else {
      return items.reverse();
    }
    return newItems.reverse();
  }

  checkUserAuth() {
    if (
      this.issue?.author?.id === this.user.id ||
      this.projectUser?.roles?.some(
        (r) =>
          r.name === ProjectLeaderRole ||
          r.name === CompanyRole ||
          r.name === CustomerRole
      )
    ) {
      return true;
    }
    return false;
  }

  fetchConversationItems(): Observable<IssueConversationItem[]> {
    return this.issueConversationService
      .getConversationItems(this.issueId)
      .pipe(
        tap((data) => (this.listOfConversations = this.filterSummaries(data)))
      );
  }

  updateSummary(accepted: boolean) {
    this.subscribe(
      this.summaryService
        .updateSummary(this.issueId, accepted)
        .pipe(switchMap(() => this.fetchConversationItems()))
    );
  }

  sendConversation(item: IssueConversationItem) {
    this.selectedConversation.next(item.data);
  }

  saveConversationItem(newItem: IssueConversationItem): Observable<any> {
    return this.issueConversationService.createConversationItem(
      this.issueId,
      newItem
    );
  }

  sendComment(): void {
    this.subscribe(
      this.saveConversationItem({
        creator: this.user,
        data: `${this.inputOfConversation}`,
        createdAt: new Date(),
        type: 'Nachricht',
      }).pipe(switchMap(() => this.fetchConversationItems()))
    );

    this.inputOfConversation = '';
  }
}
