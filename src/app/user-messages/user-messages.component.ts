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
        // Load new Messages on Site change
        this.subscribe(this.getMessages(this.userId));
      });

    // Initial Message loading
    this.subscribe(this.getMessages(this.userId));
  }

  userId: string;
  drawerVisible: boolean = false;

  listOfMessages: Message[] = [];
  listOfDisplayedMessages: Message[] = [];
  messageCount: number = 0;

  openDrawer() {
    this.drawerVisible = true;
    this.displayMoreMessages();
  }

  closeDrawer() {
    this.drawerVisible = false;
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

  updateUnreadMessageCount(): void {
    this.messageCount = this.listOfMessages.filter((m) => !m.consented).length;
  }

  getMessages(userId: string): Observable<Message[]> {
    return this.messageService.getMessagesFromUser(userId).pipe(
      tap((messages) => {
        this.listOfMessages = messages;
        this.updateUnreadMessageCount();
      })
    );
  }
}
