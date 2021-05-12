import { Component, Input, OnInit } from '@angular/core';
import { Message, MessageType } from '../../interfaces/Message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.less'],
})
export class MessageItemComponent implements OnInit {
  @Input() public message: Message;
  @Input() public closeDrawer: Function;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  handleMessageClick(message: Message) {
    let fragment: string = '0';
    if (message.type === MessageType.RecordedTimeChanged)
      fragment = '1';

    let link: string = `/${message.companyId}/projects/${message.projectId}/issues/${message.issueId}#${fragment}`;
    this.router.navigateByUrl(link).then(this.closeDrawer());
  }
}
