import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Message, MessageType } from '../interfaces/Message';
import { Observable, ObservableInput } from 'rxjs';
import { SubscriptionWrapper } from '../SubscriptionWrapper';
import { MessageService } from '../message.service';
import { filter, tap } from 'rxjs/operators';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.less'],
})
export class UserMessagesComponent
  extends SubscriptionWrapper
  implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
    // Set the UserId for the Avatar
    this.userId = this.authService.currentUserValue.id;

    // Listen to changes in the website routing for refreshing the messages
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationStart) => {
        console.log('Change');
      });

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

    // // TODO: Sorting the messages in the right way
    // this.listOfMessages = this.listOfMessages.sort((x) =>
    //   x.consented ? 1 : -1
    // ); //Move Consented to the end
    // this.listOfMessages = [...this.listOfMessages.filter(m => !m.consented), ...this.listOfMessages.filter(m => m.consented)];

    this.displayMoreMessages();
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.markMessagesAsConsented();
    this.listOfDisplayedMessages = [];
  }

  /*
   * Will display 0 <= N <= @var(maxToLoad) new Message Items and set their state as consented
   */
  displayMoreMessages(): void {
    let maxToLoad = 10;

    let possibleMessagesToAdd: number =
      this.listOfMessages.length - this.listOfDisplayedMessages.length;
    let messagesToAdd: number =
      possibleMessagesToAdd > maxToLoad ? maxToLoad : possibleMessagesToAdd;

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

  markMessagesAsConsented(): void {
    let toUpdate: ObservableInput<Message>[] = this.listOfDisplayedMessages.map(
      (m) => this.updateConsentedStatus(m)
    );

    this.updateUnreadMessageCount();
    // this.subscribe(forkJoin(toUpdate));
  }

  // demo data
  messages: Message[] = [
    {
      id: '1',
      companyId: '609421f4d837b069802b738e',
      projectId: '60942229d837b069802b7390',
      issueId: '60942254d837b069802b739a',
      consented: true,
      receiver_user: null,
      type: MessageType.TimeExceeded,
    },
    {
      id: '2',
      companyId: '609421f4d837b069802b738e',
      projectId: '60942229d837b069802b7390',
      issueId: '60942254d837b069802b739a',
      consented: false,
      receiver_user: null,
      type: MessageType.IssueCancelled,
    },
    {
      id: '3',
      companyId: '609421f4d837b069802b738e',
      projectId: '60942229d837b069802b7390',
      issueId: '60942254d837b069802b739a',
      consented: false,
      receiver_user: null,
      type: MessageType.RecordedTimeChanged,
    },
    {
      id: '4',
      companyId: '609421f4d837b069802b738e',
      projectId: '60942229d837b069802b7390',
      issueId: '60942254d837b069802b739a',
      consented: true,
      receiver_user: null,
      type: MessageType.RecordedTimeChanged,
    },
    {
      id: '5',
      companyId: '609421f4d837b069802b738e',
      projectId: '60942229d837b069802b7390',
      issueId: '60942254d837b069802b739a',
      consented: false,
      receiver_user: null,
      type: MessageType.NewConversationItem,
    },
  ];

  updateUnreadMessageCount(): void {
    this.messageCount = this.listOfMessages.filter((m) => !m.consented).length;
  }

  getMessages(userId: string): Observable<Message[]> {
    return this.messageService.getMessages(userId).pipe(
      tap((messages) => {
        this.listOfMessages = messages;
        this.updateUnreadMessageCount();
      })
    );
  }

  updateConsentedStatus(message: Message): Observable<Message> {
    message.consented = true;
    return this.messageService.updateMessage(message.id, message);
  }
}
