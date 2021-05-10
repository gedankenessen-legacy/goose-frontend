import { Component, OnInit } from '@angular/core';
import * as Identicons from 'identicon.js';
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.less']
})
export class UserMessagesComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Creating the Avatar
    this.userAvatar = `data:image/png;base64,${new Identicons(
      this.authService.currentUserValue.id,
      420
    ).toString()}`

  }

  userAvatar: any;
  messageCount: number = 12;
  drawerVisible: boolean = false;

  openDrawer() {
    console.log("Open")
    this.drawerVisible = true;
  }

  closeDrawer() {
    this.drawerVisible = false;

  }
}
