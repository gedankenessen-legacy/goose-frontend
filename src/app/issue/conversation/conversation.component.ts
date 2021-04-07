import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  listOfConversations: any[] = [];
  inputOfConversation = '';

  user = {
    author: 'Nutzername'
  };

  sendComment(): void {
    const content = this.inputOfConversation;
    this.inputOfConversation = '';
    const datepipe: DatePipe = new DatePipe('de-DE');
    let formattedDate = datepipe.transform(new Date(), 'dd.MM.YYYY HH:mm:ss')

    this.listOfConversations = [
      ...this.listOfConversations,
      {
        ...this.user,
        content,
        datetime: formattedDate
      }
    ].map(e => {
      return {
        ...e
      };
    });
  }
}
