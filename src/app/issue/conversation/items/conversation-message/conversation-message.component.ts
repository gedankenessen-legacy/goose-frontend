import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.less']
})
export class ConversationMessageComponent implements OnInit {

  @Input() item: IssueConversationItem;
  @Output() public selectedConversation: Subject<IssueConversationItem> = new Subject<IssueConversationItem>();

  constructor() { }

  ngOnInit(): void {
  }

  sendConversation(item: IssueConversationItem) {
    this.selectedConversation.next(item);
  }
}
