import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Message } from '../interfaces/Message';
import { forkJoin, Observable, ObservableInput } from 'rxjs';
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
  }

  userId: string;
  drawerVisible: boolean = false;

  listOfMessages: Message[] = [];
  listOfDisplayedMessages: Message[] = [];
  messageCount: number = 0;

  openDrawer() {
    console.log('Open');
    this.drawerVisible = true;
  }

  closeDrawer() {
    this.drawerVisible = false;
  }

  /*
   * Will display 0 <= N <= 10 new Message Items and set their state as consented
   */
  displayMoreMessages(): void {
    let possibleMessagesToAdd: number =
      this.listOfMessages.length - this.listOfDisplayedMessages.length;
    let messagesToAdd: number =
      possibleMessagesToAdd > 10 ? 10 : possibleMessagesToAdd;

    // Create a List with the message items that will later be added to the displayed list
    let addToDisplayList = this.listOfMessages.slice(
      this.listOfDisplayedMessages.length,
      this.listOfDisplayedMessages.length + messagesToAdd
    );

    // Set messages as consented in db
    let toUpdate: ObservableInput<Message>[] = addToDisplayList
      .filter((m) => !m.consented)
      .map((message) => {
        return this.updateConsentedStatus(message);
      });
    this.subscribe(forkJoin(toUpdate));

    // Set messages as consented in list
    addToDisplayList.forEach((m) => (m.consented = true));

    // Add new messages to displayed list
    this.listOfDisplayedMessages = [
      ...this.listOfMessages,
      ...addToDisplayList,
    ];
  }

  getMessages(): Observable<Message[]> {
    return this.messageService.getMessages().pipe(
      tap((messages) => {
        this.listOfMessages = messages;
        this.messageCount = messages.filter((m) => !m.consented).length;
      })
    );
  }

  updateConsentedStatus(message: Message): Observable<Message> {
    message.consented = true;
    return this.messageService.updateMessage(message.id, message);
  }
}
