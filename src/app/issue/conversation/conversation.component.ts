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
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less'],
})
export class ConversationComponent
  extends SubscriptionWrapper
  implements OnInit {
  @Input() public issueId: string;
  @Input() public projectId: string;
  @Output()
  public selectedConversation: Subject<string> = new Subject<string>();
  public issue: Issue;
  public user: User;
  public lastSummary: string;
  archivedDisabled: boolean;
  listOfConversations: IssueConversationItem[] = [];
  inputOfConversation = '';

  constructor(
    private issueConversationService: IssueConversationItemsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private issueService: IssueService,
    private summaryService: IssueSummaryService
  ) {
    super();
    this.auth.currentUser.subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.archivedDisabled = false;
    this.subscribe(
      forkJoin([
        this.issueService.getIssue(this.projectId, this.issueId),
        this.issueConversationService.getConversationItems(this.issueId),
      ]),
      (dataList) => {
        this.issue = dataList[0];
        this.listOfConversations = this.filterSummaries(dataList[1]);
        this.setArchived();
        this.setLastSummary();
        this.listOfConversations = dataList[1];

        if (this.issue.state?.name == 'Archiviert') {
          this.archivedDisabled = true;
        }
        // this.issuePredecessors = dataList[1];
        // this.issueSuccessors = dataList[2];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //TODO Datum beim Anzeigen richtig formatieren

  setArchived() {
    if (this.issue.state?.name == 'Archiviert') {
      this.archivedDisabled = true;
    }
  }

  filterSummaries(items: IssueConversationItem[]): IssueConversationItem[] {
    if (items.length < 1) {
      return [];
    }

    let reversed = items.reverse();
    let summaryIndex = reversed.findIndex((s) => s.type === 'Zusammenfassung');

    if (summaryIndex < 0) {
      return items;
    }

    let removeActiveSummaries = [...reversed
      .slice(0, summaryIndex)
      .filter((c) => c.type !== 'Zusammenfassung'), reversed[summaryIndex], ...reversed
        .slice(summaryIndex, reversed.length)
        .filter((c) => c.type !== 'Zusammenfassung')].reverse();

    let firstAcceptedSummary = removeActiveSummaries.findIndex(s => s.type === 'Zusammenfassung akzeptiert' || s.type === 'Zusammenfassung abgelehnt');
    return [
      ...removeActiveSummaries.slice(0, firstAcceptedSummary).filter(s => s.type !== 'Zusammenfassung'),
      removeActiveSummaries[firstAcceptedSummary],
      ...removeActiveSummaries.slice(firstAcceptedSummary, removeActiveSummaries.length),
    ];
  }

  setLastSummary() {
    for (let index = (this.listOfConversations.length - 1); index >= 0; index--) {
      if (this.listOfConversations[index].type == "Zusammenfassung") {
        this.lastSummary = this.listOfConversations[index].id;
        break;
      }
    }
  }

  fetchConversationItems(): void {
    this.issueConversationService.getConversationItems(this.issueId).pipe(
      tap(data => this.listOfConversations = this.filterSummaries(data))).subscribe();
  }

  acceptSummary() {
    this.summaryService.updateSummary(this.issueId, true).subscribe();
    this.fetchConversationItems();
  }

  declineSummary() {
    this.summaryService.updateSummary(this.issueId, false).subscribe();
    this.fetchConversationItems();
  }

  sendConversation(item: IssueConversationItem) {
    item['selected'] = true;
    this.selectedConversation.next(item.data);
  }

  saveConversationItem(newItem: IssueConversationItem) {
    this.issueConversationService
      .createConversationItem(this.issueId, newItem)
      .subscribe(
        (data) => { },
        (error) => {
          // TODO Fehlerausgabe
          console.error(error);
        }
      );
  }

  formatDate(date: Date): string {
    const datepipe: DatePipe = new DatePipe('de-DE');
    return datepipe.transform(date, 'dd.MM.YYYY HH:mm:ss');
  }

  sendComment(): void {
    const content = this.inputOfConversation;
    this.inputOfConversation = '';

    const newItem: IssueConversationItem = {
      creator: this.user,
      data: content,
      createdAt: new Date(),
      type: 'Nachricht',
    };

    this.saveConversationItem(newItem);

    this.listOfConversations = [...this.listOfConversations, newItem].map(
      (e) => {
        return {
          ...e,
        };
      }
    );
  }
}
