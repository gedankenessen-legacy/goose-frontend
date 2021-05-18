import { Component, Input, OnInit } from '@angular/core';
import { Message, MessageType } from '../../interfaces/Message';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Issue } from '../../interfaces/issue/Issue';
import { SubscriptionWrapper } from '../../SubscriptionWrapper';
import { IssueService } from '../../issue/issue.service';
import { tap } from 'rxjs/operators';
import { MessageService } from "../../message.service";

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.less'],
})
export class MessageItemComponent
  extends SubscriptionWrapper
  implements OnInit {
  @Input() public message: Message;
  @Input() public closeDrawer: Function;
  issueName: string;

  constructor(private router: Router, private issueService: IssueService, private messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.getTicket(this.message.projectId, this.message.issueId)
    );
  }

  handleMessageClick(message: Message) {
    let fragment: string = '0';
    if (message.type === MessageType.RecordedTimeChanged)
      fragment = '1';

    this.subscribe(this.updateConsentedStatus(message, fragment));
  }

  getTicket(projectId: string, issueId: string): Observable<Issue> {
    return this.issueService
      .getIssue(projectId, issueId)
      .pipe(tap((issue) => (this.issueName = issue.issueDetail.name)));
  }

  updateConsentedStatus(message: Message, fragment: string): Observable<Message> {
    message.consented = true;
    return this.messageService.updateMessage(message.id, message).pipe(tap(message => {
      let link: string = `/${message.companyId}/projects/${message.projectId}/issues/${message.issueId}#${fragment}`;
      this.router.navigateByUrl(link).then(this.closeDrawer());
    }));
  }
}
