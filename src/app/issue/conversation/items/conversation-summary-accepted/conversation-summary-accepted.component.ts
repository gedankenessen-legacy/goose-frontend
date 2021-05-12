import { Component, Input, OnInit } from '@angular/core';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-summary-accepted',
  templateUrl: './conversation-summary-accepted.component.html',
  styleUrls: ['./conversation-summary-accepted.component.less']
})
export class ConversationSummaryAcceptedComponent implements OnInit {
  @Input() item: IssueConversationItem;
  constructor() { }

  ngOnInit(): void {
  }

}
