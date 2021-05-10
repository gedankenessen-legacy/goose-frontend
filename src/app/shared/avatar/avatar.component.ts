import { Component, Input, OnInit } from '@angular/core';
import * as Identicons from 'identicon.js';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.less'],
})
export class AvatarComponent implements OnInit {
  @Input() id: string;

  constructor() {}
  ngOnInit(): void {}

  source(): string {
    return `data:image/png;base64,${new Identicons(this.id, 420).toString()}`;
  }
}
