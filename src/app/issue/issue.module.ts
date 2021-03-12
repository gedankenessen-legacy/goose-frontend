import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './conversation/conversation.component';
import { IssueRoutingModule } from './issue-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ConversationComponent],
  imports: [
    CommonModule,
    IssueRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class IssueModule { }
