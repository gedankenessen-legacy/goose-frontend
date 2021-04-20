import { Component, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';
import { User } from 'src/app/interfaces/User';
import { IssueConversationItemsService } from '../issue-conversation-items.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { Observable, Subject } from 'rxjs';

@Component({ 
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less'],
})
export class ConversationComponent implements OnInit {

  @Input() public issueObservable: Observable<Issue>;
  @Output() public selectedConversation: Subject<string> = new Subject<string>();
  public issue: Issue;
  public user: User;
  archivedDisabled: boolean;


  constructor(
    private issueConversationService: IssueConversationItemsService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.auth.currentUser.subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.archivedDisabled = false; 
  }

  ngAfterViewInit(): void {
    this.issueObservable.subscribe(issue => {
      this.issue = issue;
      this.getConversationItems();
    });
    if(this.issue.state.name == "Archiviert"){
      this.archivedDisabled = true;  
    }
  }

  //TODO Datum beim Anzeigen richtig formatieren
  listOfConversations: IssueConversationItem[] = [];
  inputOfConversation = '';
  loading: boolean = false;

  getConversationItems() {
    this.loading = true;
    this.issueConversationService.getConversationItems(this.issue.id).subscribe(
      (data) => {
        this.listOfConversations = data;
        this.loading = false;
        console.log(this.listOfConversations);
      },
      (error) => {
        // TODO Fehlerausgabe
        console.error(error);
        this.loading = false;
      }
    );
  }

  sendConversation(item: IssueConversationItem){
    item['selected'] = true;
    this.selectedConversation.next(item.data);
  }

  saveConversationItem(newItem: IssueConversationItem) {
    this.issueConversationService
      .createConversationItem(this.issue.id, newItem)
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
