import { Component, Input, OnInit } from '@angular/core';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-predecessor-removed',
  templateUrl: './conversation-predecessor-removed.component.html',
  styleUrls: ['./conversation-predecessor-removed.component.less'],
})
export class ConversationPredecessorRemovedComponent implements OnInit {
  @Input() item: IssueConversationItem;
  dateString: String;
  constructor() {}

  ngOnInit(): void {
    this.item.createdAt = new Date(this.item.createdAt);
    this.item.createdAt = new Date(
      Date.UTC(
        this.item.createdAt.getFullYear(),
        this.item.createdAt.getMonth(),
        this.item.createdAt.getDay(),
        this.item.createdAt.getHours(),
        this.item.createdAt.getMinutes(),
        0
      )
    );
    this.dateString = this.item.createdAt.toLocaleString('de-DE', {
      timeZone: 'UTC',
    });
  }
}
