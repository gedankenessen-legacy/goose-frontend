import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './conversation/conversation.component';
import { IssueRoutingModule } from './issue-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';


@NgModule({
  declarations: [ConversationComponent],
  imports: [
    CommonModule,
    IssueRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzCommentModule,
    NzAvatarModule,
    NzFormModule,
    NzButtonModule
  ]
})
export class IssueModule { }
