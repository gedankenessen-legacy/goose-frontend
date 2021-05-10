import { Component, Input, OnInit } from '@angular/core';
import { Message } from "../../interfaces/Message";

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.less']
})
export class MessageItemComponent implements OnInit {
  @Input() public message: Message;

  constructor() { }

  ngOnInit(): void {
  }

}
