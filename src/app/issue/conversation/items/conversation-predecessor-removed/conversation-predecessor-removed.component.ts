import { Component, Input, OnInit } from '@angular/core';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-predecessor-removed',
  templateUrl: './conversation-predecessor-removed.component.html',
  styleUrls: ['./conversation-predecessor-removed.component.less']
})
export class ConversationPredecessorRemovedComponent implements OnInit {
  @Input() item: IssueConversationItem;
  constructor() { }

  ngOnInit(): void {
  }

}
