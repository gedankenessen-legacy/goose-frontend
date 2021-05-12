import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { IssueRoutingModule } from './issue-routing.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConversationComponent } from './conversation/conversation.component';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzListModule } from 'ng-zorro-antd/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IssueComponent } from './issue/issue.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { IssueAssignedComponent } from './issue-assigned/issue-assigned.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { SummaryComponent } from './summary/summary.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ConversationMessageComponent } from './conversation/items/conversation-message/conversation-message.component';
import { ConversationStatusComponent } from './conversation/items/conversation-status/conversation-status.component';
import { ConversationSummaryAcceptedComponent } from './conversation/items/conversation-summary-accepted/conversation-summary-accepted.component';
import { ConversationSummaryDeclinedComponent } from './conversation/items/conversation-summary-declined/conversation-summary-declined.component';
import { ConversationPredecessorAddedComponent } from './conversation/items/conversation-predecessor-added/conversation-predecessor-added.component';
import { ConversationPredecessorRemovedComponent } from './conversation/items/conversation-predecessor-removed/conversation-predecessor-removed.component';
import { ConversationSubTaskAddedComponent } from './conversation/items/conversation-sub-task-added/conversation-sub-task-added.component';
import { ConversationSubTaskRemovedComponent } from './conversation/items/conversation-sub-task-removed/conversation-sub-task-removed.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    ConversationComponent,
    IssueComponent,
    SettingsComponent,
    IssueAssignedComponent,
    SummaryComponent,
    ConversationMessageComponent,
    ConversationStatusComponent,
    ConversationSummaryAcceptedComponent,
    ConversationSummaryDeclinedComponent,
    ConversationPredecessorAddedComponent,
    ConversationPredecessorRemovedComponent,
    ConversationSubTaskAddedComponent,
    ConversationSubTaskRemovedComponent,
  ],
  imports: [
    CommonModule,
    IssueRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzCommentModule,
    NzSliderModule,
    NzAvatarModule,
    NzSelectModule,
    NzFormModule,
    NzDatePickerModule,
    NzInputModule,
    NzButtonModule,
    NzListModule,
    ScrollingModule,
    NzTypographyModule,
    NzMenuModule,
    NzGridModule,
    NzIconModule,
    NzSpinModule,
    NzTableModule,
    NzInputNumberModule,
    NzCardModule,
    NzAutocompleteModule,
    NzDrawerModule,
    NzModalModule,
    NzIconModule,
    SharedModule
  ],
})
export class IssueModule {}
