import { Component, Input, OnInit } from '@angular/core';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-summary',
  templateUrl: './conversation-summary.component.html',
  styleUrls: ['./conversation-summary.component.less']
})
export class ConversationSummaryComponent implements OnInit {
  @Input() item: IssueConversationItem;
  constructor() { }

  ngOnInit(): void {
  }
  
}
