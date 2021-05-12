import { Component, Input, OnInit } from '@angular/core';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-predecessor-added',
  templateUrl: './conversation-predecessor-added.component.html',
  styleUrls: ['./conversation-predecessor-added.component.less'],
})
export class ConversationPredecessorAddedComponent implements OnInit {
  @Input() item: IssueConversationItem;
  constructor() {}

  ngOnInit(): void {}
}
