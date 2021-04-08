import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NzGridModule } from "ng-zorro-antd/grid";


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
    NzDropDownModule,
    NzAutocompleteModule,
    NzGridModule
  ]
})
export class ProjectModule { }
