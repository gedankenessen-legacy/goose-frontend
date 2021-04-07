import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IssueRoutingModule } from './issue-routing.module';

import { ConversationComponent } from './conversation/conversation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IssueComponent } from './issue/issue.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';


@NgModule({
  declarations: [DashboardComponent, ConversationComponent, IssueComponent],
  imports: [
    CommonModule,
    IssueRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzCommentModule,
    NzAvatarModule,
    NzFormModule,
    NzButtonModule,
    NzListModule,
    ScrollingModule,
    NzTypographyModule,
    NzMenuModule,
    NzGridModule,
    NzIconModule,
    NzSpinModule,
    NzTableModule
  ]
})
export class IssueModule {}
