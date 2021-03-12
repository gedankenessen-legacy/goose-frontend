import { Component, OnInit } from '@angular/core';
import { formatDistance } from 'date-fns';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

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

  user = {
    author: 'Nutzername'
  };

  inputValue = '';

  handleSubmit(): void {
    const content = this.inputValue;
    this.inputValue = '';

    this.listOfConversations = [
      ...this.listOfConversations,
      {
        ...this.user,
        content,
        datetime: new Date(),
        displayTime: formatDistance(new Date(), new Date())
      }
    ].map(e => {
      return {
        ...e,
        displayTime: formatDistance(new Date(), e.datetime)
      };
    });
  }
}
