import { Component, Input, OnInit } from '@angular/core';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-summary-declined',
  templateUrl: './conversation-summary-declined.component.html',
  styleUrls: ['./conversation-summary-declined.component.less'],
})
export class ConversationSummaryDeclinedComponent implements OnInit {
  @Input() item: IssueConversationItem;
  constructor() {}

  ngOnInit(): void {}
}
