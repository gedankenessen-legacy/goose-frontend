import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { IssueConversationItem } from 'src/app/interfaces/issue/IssueConversationItem';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { CustomerRole, ReadonlyEmployeeRole } from 'src/app/interfaces/Role';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.less'],
})
export class ConversationMessageComponent implements OnInit {
  @Input() item: IssueConversationItem;
  @Input() projectUser: ProjectUser;
  @Input() summaryActive: Boolean;
  dateString: String;

  @Output()
  public selectedConversation: Subject<IssueConversationItem> = new Subject<IssueConversationItem>();

  constructor() {}

  ngOnInit(): void {
    this.item.createdAt = new Date(this.item.createdAt);
    this.item.createdAt = new Date(
      Date.UTC(
        this.item.createdAt.getFullYear(),
        this.item.createdAt.getMonth(),
        this.item.createdAt.getDay(),
        this.item.createdAt.getHours(),
        this.item.createdAt.getMinutes(),
        0
      )
    );
    this.dateString = this.item.createdAt.toLocaleString('de-DE', {
      timeZone: 'UTC',
    });
  }

  readRights(): boolean {
    if (this.projectUser?.roles?.some((r) => r.name === CustomerRole)) {
      return true;
    } else {
      return this.projectUser?.roles?.some(
        (r) => r.name === ReadonlyEmployeeRole
      );
    }
  }

  sendConversation(item: IssueConversationItem) {
    this.selectedConversation.next(item);
  }
}
