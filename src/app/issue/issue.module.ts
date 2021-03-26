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



@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    IssueRoutingModule,
    NzGridModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzSliderModule,
    NzSelectModule,
    NzTableModule,
    NzDatePickerModule,
    NzButtonModule
  ]
})
export class IssueModule { }
