import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProjectRoutingModule } from './project-routing.module';
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [DashboardComponent, SettingsComponent],
  imports: [
    CommonModule,
    NzTableModule,
    ProjectRoutingModule,
    NzButtonModule,
    NzIconModule,
    NzPopoverModule
  ]
})
export class ProjectModule { }
