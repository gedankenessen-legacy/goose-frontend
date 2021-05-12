import { Component, Input, OnInit } from '@angular/core';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-status',
  templateUrl: './conversation-status.component.html',
  styleUrls: ['./conversation-status.component.less']
})
export class ConversationStatusComponent implements OnInit {
  @Input() item: IssueConversationItem;
  constructor() { }

  ngOnInit(): void {
  }

}
