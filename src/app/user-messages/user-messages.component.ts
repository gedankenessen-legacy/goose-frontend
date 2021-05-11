import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Message } from '../interfaces/Message';
import { Observable } from 'rxjs';
import { SubscriptionWrapper } from '../SubscriptionWrapper';
import { MessageService } from '../message.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.less'],
})
export class UserMessagesComponent
  extends SubscriptionWrapper
  implements OnInit {
  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
    // Set the UserId for the Avatar
    this.userId = this.authService.currentUserValue.id;

    // this.subscribe(this.getMessages());
    this.listOfMessages = this.messages;
    this.updateUnreadMessageCount();
  }

  userId: string;
  drawerVisible: boolean = false;

  listOfMessages: Message[] = [];
  listOfDisplayedMessages: Message[] = [];
  messageCount: number = 0;

  openDrawer() {
    this.drawerVisible = true;
    this.listOfMessages = this.listOfMessages.sort((x) =>
      x.consented ? 1 : -1
    );
    // this.listOfMessages = [...this.listOfMessages.filter(m => !m.consented), ...this.listOfMessages.filter(m => m.consented)];
    this.displayMoreMessages();
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.listOfDisplayedMessages = [];
  }

  handleMessageClick = (message: Message) => {
    message.consented = true;
    //TODO: update with subscribe in db

    this.updateUnreadMessageCount();
  };

  /*
   * Will display 0 <= N <= 10 new Message Items and set their state as consented
   */
  displayMoreMessages(): void {
    let possibleMessagesToAdd: number =
      this.listOfMessages.length - this.listOfDisplayedMessages.length;
    let messagesToAdd: number =
      possibleMessagesToAdd > 2 ? 2 : possibleMessagesToAdd;

    // Create a List with the message items that will later be added to the displayed list
    let addToDisplayList = this.listOfMessages.slice(
      this.listOfDisplayedMessages.length,
      this.listOfDisplayedMessages.length + messagesToAdd
    );

    // Add new messages to displayed list
    this.listOfDisplayedMessages = [
      ...this.listOfDisplayedMessages,
      ...addToDisplayList,
    ];

    // Update unread messages counter
    this.updateUnreadMessageCount();
  }

  // demo data
  messages: Message[] = [
    {
      id: '',
      consented: true,
      data: 'Data 1',
      receiver_user: null,
      type: '',
    },
    {
      id: '',
      consented: true,
      data: 'Data 2',
      receiver_user: null,
      type: '',
    },
    {
      id: '',
      consented: false,
      data: 'Data 3',
      receiver_user: null,
      type: '',
    },
    {
      id: '',
      consented: false,
      data: 'Data 4',
      receiver_user: null,
      type: '',
    },
    {
      id: '',
      consented: false,
      data: 'Data 5',
      receiver_user: null,
      type: '',
    },
  ];

  updateUnreadMessageCount(): void {
    this.messageCount = this.listOfMessages.filter((m) => !m.consented).length;
  }

  getMessages(): Observable<Message[]> {
    return this.messageService.getMessages().pipe(
      tap((messages) => {
        this.listOfMessages = messages.sort((a, b) =>
          a === b ? 0 : a ? -1 : 1
        );
        this.updateUnreadMessageCount();
      })
    );
  }

  updateConsentedStatus(message: Message): Observable<Message> {
    message.consented = true;
    return this.messageService.updateMessage(message.id, message);
  }
}
