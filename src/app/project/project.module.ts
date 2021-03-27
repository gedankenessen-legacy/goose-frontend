import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProjectRoutingModule } from './project-routing.module';
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from "@angular/forms";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";


@NgModule({
  declarations: [DashboardComponent, SettingsComponent],
  imports: [
    CommonModule,
    NzTableModule,
    ProjectRoutingModule,
    NzButtonModule,
    NzIconModule,
    NzPopoverModule,
    FormsModule,
    NzSelectModule,
    NzListModule,
    NzInputModule,
    NzRadioModule,
    NzDropDownModule
  ]
})
export class ProjectModule { }
