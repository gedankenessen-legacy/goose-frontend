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
  archivedDisabled: boolean;
  listOfConversations: IssueConversationItem[] = [];
  inputOfConversation = '';

  constructor(
    private issueConversationService: IssueConversationItemsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private issueService: IssueService
  ) {
    super();
    this.auth.currentUser.subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.archivedDisabled = false;

    this.subscribe(
      forkJoin([
        //this.projectUserService.getProjectUser(
        //  this.projectId,
        //  this.authService.currentUserValue.id
        //),
        this.issueService.getIssue(this.projectId, this.issueId),
        this.issueConversationService.getConversationItems(this.issueId),
        //this.IssueRequirementService.getRequirements(this.issueId),
        // this.issuePredecessorService.getPredecessors(this.issueId),
        // this.issueSuccessorService.getSuccessors(this.issueId),
      ]),
      (dataList) => {
        this.issue = dataList[0];
        this.listOfConversations = dataList[1];

        // console.log(this.listOfConversations);

        if (this.issue.state?.name == 'Archiviert') {
          this.archivedDisabled = true;
        }
        // this.issuePredecessors = dataList[1];
        // this.issueSuccessors = dataList[2];
      },
      (error) => {
        console.error(error);
        // this.modal.error({
        //   nzTitle: 'This is an error message',
        //   nzContent: 'some messages...some messages...',
        // });
      }
    );
  }

  // ngAfterViewInit(): void {
  //   // this.getConversationItems();
  // }

  //TODO Datum beim Anzeigen richtig formatieren

  // loading: boolean = false;

  // getConversationItems() {
  //   this.loading = true;
  //   this.issueConversationService.getConversationItems(this.issue.id).subscribe(
  //     (data) => {
  //       console.log(data);

  //       this.listOfConversations = data;
  //       this.loading = false;
  //     },
  //     (error) => {
  //       // TODO Fehlerausgabe
  //       console.error(error);
  //       this.loading = false;
  //     }
  //   );
  // }

  sendConversation(item: IssueConversationItem) {
    item['selected'] = true;
    this.selectedConversation.next(item.data);
  }

  saveConversationItem(newItem: IssueConversationItem) {
    this.issueConversationService
      .createConversationItem(this.issueId, newItem)
      .subscribe(
        (data) => {},
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
