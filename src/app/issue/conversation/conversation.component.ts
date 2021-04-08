import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';
import { User } from 'src/app/interfaces/User';
import { IssueConversationItemsService } from '../issue-conversation-items.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less'],
})
export class ConversationComponent implements OnInit {
  @Input() public issueId: string;

  constructor(
    private issueConversationService: IssueConversationItemsService
  ) {}

  ngOnInit(): void {
    this.getConversationItems();
  }

  //TODO Datum beim Anzeigen richtig formatieren
  listOfConversations: IssueConversationItem[] = [];
  inputOfConversation = '';
  loading: boolean = false;

  //TODO Richtigen Benutzer einfügen
  user: User = {
    id: '605cc95bd37ccd8527c2ead6',
    username: null,
    firstname: 'TestUser',
    lastname: 'TestNick',
  };

  //TODO Richtigen Type einfügen
  type = '';

  getConversationItems() {
    this.loading = true;

    this.issueConversationService.getConversationItems(this.issueId).subscribe(
      (data) => {
        this.listOfConversations = data;

        this.loading = false;
      },
      (error) => {
        // TODO Fehlerausgabe
        console.error(error);
        this.loading = false;
      }
    );
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
