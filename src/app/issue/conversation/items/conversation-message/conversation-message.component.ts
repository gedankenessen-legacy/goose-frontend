import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { ReadonlyEmployeeRole } from 'src/app/interfaces/Role';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.less'],
})
export class ConversationMessageComponent implements OnInit {
  @Input() item: IssueConversationItem;
  @Input() projectUser: ProjectUser;

  @Output()
  public selectedConversation: Subject<IssueConversationItem> = new Subject<IssueConversationItem>();

  constructor() {}

  ngOnInit(): void {}

  readRights(): boolean {
    return this.projectUser?.roles?.some(
      (r) => r.name === ReadonlyEmployeeRole
    );
  }

  sendConversation(item: IssueConversationItem) {
    this.selectedConversation.next(item);
  }
}
