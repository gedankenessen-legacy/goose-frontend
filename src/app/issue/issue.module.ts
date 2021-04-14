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
import { NzCardModule } from "ng-zorro-antd/card";
import { NzAutocompleteModule } from "ng-zorro-antd/auto-complete";

@NgModule({
  declarations: [DashboardComponent, ConversationComponent, IssueComponent, SettingsComponent, IssueAssignedComponent],
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
    NzCardModule,
    NzAutocompleteModule,
  ],
})
export class IssueModule { }
