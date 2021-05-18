import { Component, Input, OnInit } from '@angular/core';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';

@Component({
  selector: 'app-conversation-sub-task-added',
  templateUrl: './conversation-sub-task-added.component.html',
  styleUrls: ['./conversation-sub-task-added.component.less'],
})
export class ConversationSubTaskAddedComponent implements OnInit {
  @Input() item: IssueConversationItem;
  constructor() {}

  ngOnInit(): void {}
}
