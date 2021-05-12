import { Component, Input, OnInit } from '@angular/core';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-sub-task-removed',
  templateUrl: './conversation-sub-task-removed.component.html',
  styleUrls: ['./conversation-sub-task-removed.component.less']
})
export class ConversationSubTaskRemovedComponent implements OnInit {
  @Input() item: IssueConversationItem;
  constructor() { }

  ngOnInit(): void {
  }

}
